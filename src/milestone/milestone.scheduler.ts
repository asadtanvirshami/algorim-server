import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { MilestoneService } from './milestone.service';

@Injectable()
export class MilestoneScheduler {
  constructor(private readonly milestoneService: MilestoneService) {}

  startSchedules() {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
      await this.milestoneService.checkDueDates();
    });
  }
}
