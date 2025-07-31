import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FetchJobService } from './fetch-jobs.service';
import { JobEntity } from '../entities/job.entity';
import { CompanyEntity } from '../entities/company.entity';
import { SkillEntity } from '../entities/skill.entity';

describe('FetchJobService (integration)', () => {
  let service: FetchJobService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test', '.env'], // include both
        }),
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          entities: [JobEntity, CompanyEntity, SkillEntity],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([JobEntity, CompanyEntity, SkillEntity]),
      ],
      providers: [FetchJobService],
    }).compile();

    service = module.get<FetchJobService>(FetchJobService);
  }, 90000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch jobs from both APIs', async () => {
    await service.fetchAllJobs();
  });
});
