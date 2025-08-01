import { Injectable, Logger } from '@nestjs/common';
import { FetchJobService } from './fetch-jobs.service';
import * as Sentry from '@sentry/node';


@Injectable()
export class EventHandlerService {
  private readonly logger = new Logger('EventHandlerService');

  constructor(private readonly fetchJobService: FetchJobService) {}

  async remindEvent() {
    try {
      await this.fetchJobService.fetchAllJobs();
      this.logger.error('Fetch All Jobs is done');
      Sentry.captureException('Fetch All Jobs is done');
    } catch (e) {
      this.logger.error('Operation failed. %o', e);
      Sentry.captureException(e);
      
    }
  }
}
