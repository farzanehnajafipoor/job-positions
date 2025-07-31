import { Controller, Get, Query } from '@nestjs/common';
import { EventHandlerService } from './services/event-handler.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FilterJobsDto } from './dto/request.dto';
import { JobProvider } from './job.provider';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedJobsDto } from './dto/response';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(
    private readonly eventHandler: EventHandlerService,
    private readonly jobProvider: JobProvider,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async fetchJobPositions() {
    await this.eventHandler.remindEvent();
  }

  @Get()
  @ApiOkResponse({ type: PaginatedJobsDto })
  getJobs(@Query() filter: FilterJobsDto): Promise<PaginatedJobsDto> {
    return this.jobProvider.findJobs(filter);
  }
}
