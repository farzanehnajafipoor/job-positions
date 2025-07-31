import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './job.controller';
import { JobProvider } from './job.provider';
import { JobEntity } from './entities/job.entity';
import { CompanyEntity } from './entities/company.entity';
import { SkillEntity } from './entities/skill.entity';
import { EventHandlerService } from './services/event-handler.service';
import { FetchJobService } from './services/fetch-jobs.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity, CompanyEntity, SkillEntity]),
    HttpModule,
  ],
  controllers: [JobController],
  providers: [JobProvider, EventHandlerService, FetchJobService],
})
export class JobModule {}
