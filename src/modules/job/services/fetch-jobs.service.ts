import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './../entities/job.entity';
import { CompanyEntity } from './../entities/company.entity';
import { SkillEntity } from './../entities/skill.entity';
import 'dotenv/config';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  CompanyDto,
  JobDto,
  StructureAItems,
  StructureBItems,
} from '../dto/types';

@Injectable()
export class FetchJobService {
  private readonly logger = new Logger('FetchJobService');
  private readonly url1: string;
  private readonly url2: string;

  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepo: Repository<JobEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepo: Repository<SkillEntity>,
    private readonly httpService: HttpService,
  ) {
    this.url1 =
      process.env.FETCH_JOB_API_URL1 ||
      'https://assignment.devotel.io/api/provider1/jobs';
    this.url2 =
      process.env.FETCH_JOB_API_URL2 ||
      'https://assignment.devotel.io/api/provider2/jobs';
  }

  private async findOrCreateSkill(name: string): Promise<SkillEntity> {
    let skill = await this.skillRepo.findOne({ where: { name } });
    if (!skill) {
      skill = this.skillRepo.create({ name });
      await this.skillRepo.save(skill);
    }
    return skill;
  }

  private async findOrCreateCompany(data: CompanyDto): Promise<CompanyEntity> {
    let company = await this.companyRepo.findOne({
      where: { name: data.name },
    });

    if (!company) {
      company = this.companyRepo.create({
        name: data.name,
        industry: data.industry,
        website: data.website,
        city: data.city,
        state: data.state,
        remote: data.remote,
        fullAddress: data.fullAddress,
      });
      await this.companyRepo.save(company);
    }
    return company;
  }

  private async upsertJob(data: JobDto): Promise<JobEntity> {
    let job = await this.jobRepo.findOne({
      where: { jobKey: data.jobKey },
      relations: ['skills'],
    });
    if (!job) {
      job = this.jobRepo.create();
      job.jobKey = data.jobKey;
    }

    job.title = data.title;
    job.company = data.company;
    job.jobType = data.jobType;
    job.salaryMin = data.salaryMin;
    job.salaryMax = data.salaryMax;
    job.salaryCurrency = data.salaryCurrency || 'USD';
    job.salaryRangeStr = data.salaryRangeStr;
    job.experience = data.experience;
    job.postedDate = data.postedDate;

    job = await this.jobRepo.save(job);

    job.skills = await Promise.all(
      data.skills.map((skillName) => this.findOrCreateSkill(skillName)),
    );

    await this.jobRepo.save(job);

    return job;
  }

  async ingestStructureA(data: StructureAItems): Promise<void> {
    if (!data?.jobs) {
      this.logger.error('No jobs found in structure A response');
      return;
    }

    for (const job of data.jobs) {
      const company = await this.findOrCreateCompany({
        name: job.company.name,
        industry: job.company.industry,
        fullAddress: job.details.location,
      });

      const { min: salaryMin, max: salaryMax } = this.parseSalaryRange(
        job.details.salaryRange,
      );

      await this.upsertJob({
        jobKey: job.jobId,
        title: job.title,
        company,
        jobType: job.details.type,
        salaryMin,
        salaryMax,
        salaryCurrency: 'USD',
        salaryRangeStr: job.details.salaryRange,
        experience: undefined,
        postedDate: new Date(job.postedDate),
        skills: job.skills,
        fullAddress: job.details.location,
      });
    }
  }

  async ingestStructureB(data: StructureBItems): Promise<void> {
    if (!data.data?.jobsList) {
      this.logger.error('No jobsList found in structure B response');
      return;
    }

    for (const [jobKey, job] of Object.entries(data.data.jobsList ?? {})) {
      const company = await this.findOrCreateCompany({
        name: job.employer.companyName,
        website: job.employer.website,
        city: job.location.city,
        state: job.location.state,
        remote: job.location.remote,
        fullAddress: `${job.location.city}, ${job.location.state}`,
      });

      await this.upsertJob({
        jobKey,
        title: job.position,
        company,
        jobType: undefined,
        salaryMin: job.compensation.min,
        salaryMax: job.compensation.max,
        salaryCurrency: job.compensation.currency,
        salaryRangeStr: undefined,
        experience: job.requirements.experience,
        postedDate: new Date(job.datePosted),
        skills: job.requirements.technologies,
        city: job.location.city,
        state: job.location.state,
        remote: job.location.remote,
        fullAddress: `${job.location.city}, ${job.location.state}`,
      });
    }
  }

  async fetchAllJobs() {
    try {
      const [dataA, dataB] = await Promise.all([
        this.fetchFromUrl<StructureAItems>(this.url1),
        this.fetchFromUrl<StructureBItems>(this.url2),
      ]);

      if (!dataA || !dataB) {
        this.logger.error('One or more job data sources failed to fetch.');
        return;
      }

      await this.ingestStructureA(dataA);
      await this.ingestStructureB(dataB);
    } catch (error) {
      this.logger.error('Error fetching jobs', error);
      throw error;
    }
  }

  private async fetchFromUrl<T>(url: string): Promise<T | null> {
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      if (response.status !== 200) {
        this.logger.error(
          `Failed to fetch from ${url}, status: ${response.status}`,
        );
        return null;
      }
      return response.data as T;
    } catch (error) {
      this.logger.error(`Failed to fetch from ${url}`, error);
      return null;
    }
  }

  private parseSalaryRange(range?: string): { min?: number; max?: number } {
    if (!range) return {};
    const match = range.match(/\$?(\d+)k?\s*-\s*\$?(\d+)k?/i);
    if (match) {
      return {
        min: parseInt(match[1]) * 1000,
        max: parseInt(match[2]) * 1000,
      };
    }
    return {};
  }
}
