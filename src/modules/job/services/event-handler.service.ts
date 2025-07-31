import { Injectable, Logger } from '@nestjs/common';
import { FetchJobService } from './fetch-jobs.service';

@Injectable()
export class EventHandlerService {
  private readonly logger = new Logger('EventHandlerService');

  constructor(private readonly fetchJobService: FetchJobService) {}

  async remindEvent() {
    try {
      await this.fetchJobService.fetchAllJobs();
      this.logger.log('Fetch All Jobs is done');
    } catch (e) {
      this.logger.error('Operation failed. %o', e);
    }
  }
}
