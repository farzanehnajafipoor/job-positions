import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { FilterJobsDto } from './dto/request.dto';
import { JobDto, PaginatedJobsDto } from './dto/response';
import * as Sentry from '@sentry/node';

export class JobProvider {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}
  async findJobs(filter: FilterJobsDto): Promise<PaginatedJobsDto> {
    try {
    const { jobName, companyName, minSalary, maxSalary, page, limit } = filter;
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company');

    if (jobName) {
      query.andWhere('job.title ILIKE :jobName', { jobName: `%${jobName}%` });
    }

    if (companyName) {
      query.andWhere('company.name ILIKE :companyName', {
        companyName: `%${companyName}%`,
      });
    }

    if (minSalary !== undefined) {
      query.andWhere('job.salaryMin >= :minSalary', { minSalary });
    }

    if (maxSalary !== undefined) {
      query.andWhere('job.salaryMax <= :maxSalary', { maxSalary });
    }

    query.skip((page - 1) * limit).take(limit);

    const [jobs, total] = await query.getManyAndCount();

    const data: JobDto[] = jobs.map((job) => ({
      id: job.id,
      name: job.title,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      companyName: job.company?.name,
    }));

    return { data, total, page, limit };
  } catch (error) {
      Sentry.captureException(error);
      throw new Error('Failed to fetch jobs');
    }
  }
}
