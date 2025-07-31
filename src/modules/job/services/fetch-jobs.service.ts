import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './../entities/job.entity';
import { CompanyEntity } from './../entities/company.entity';
import { SkillEntity } from './../entities/skill.entity';
import 'dotenv/config';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { StructureAData, StructureBData } from '../dto/types';

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

  private async findOrCreateCompany(data: {
    name: string;
    industry?: string;
    website?: string;
    city?: string;
    state?: string;
    remote?: boolean;
    fullAddress?: string;
  }): Promise<CompanyEntity> {
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

  private async upsertJob(data: {
    jobKey: string;
    title: string;
    company: CompanyEntity;
    jobType?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryRangeStr?: string;
    experience?: number;
    postedDate: Date;
    skills: string[];
    city?: string;
    state?: string;
    remote?: boolean;
    fullAddress?: string;
  }): Promise<JobEntity> {
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

    const skillEntities: SkillEntity[] = [];
    for (const skillName of data.skills) {
      const skill = await this.findOrCreateSkill(skillName);
      skillEntities.push(skill);
    }
    job.skills = skillEntities;
    await this.jobRepo.save(job);
    return job;
  }

  async ingestStructureA(data: StructureAData): Promise<void> {
    if (!data?.jobs) {
      this.logger.error('No jobsList found in structure A response');
      return;
    }

    for (const job of data.jobs) {
      const company = await this.findOrCreateCompany({
        name: job.company.name,
        industry: job.company.industry,
        fullAddress: job.details.location,
      });

      let salaryMin: number | undefined;
      let salaryMax: number | undefined;
      if (job.details.salaryRange) {
        const match = job.details.salaryRange.match(
          /\$?(\d+)k?\s*-\s*\$?(\d+)k?/i,
        );
        if (match) {
          salaryMin = parseInt(match[1]) * 1000;
          salaryMax = parseInt(match[2]) * 1000;
        }
      }

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

  async ingestStructureB(data: StructureBData): Promise<void> {
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
        this.fetchFromUrl<StructureAData>(this.url1),
        this.fetchFromUrl<StructureBData>(this.url2),
      ]);

      await this.ingestStructureA(dataA);
      await this.ingestStructureB(dataB);
    } catch (error) {
      this.logger.error('Error fetching jobs', error);
      console.log('error', error);
      throw error;
    }
  }

  private async fetchFromUrl<T>(url: string): Promise<T> {
    try {
      const response$ = this.httpService.get(url);
      const response = await lastValueFrom(response$);
      if (response.status !== 200) {
        this.logger.error(
          `Failed to fetch from ${url}, status: ${response.status}`,
        );
      }
      return response.data as T;
    } catch (error) {
      this.logger.error(`Failed to fetch from ${url}`, error);
      return {} as T;
    }
  }
}
