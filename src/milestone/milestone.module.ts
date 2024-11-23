import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from './../schemas/milestone/milestone.schema';
import { MilestoneService } from './milestone.service';
import { MilestoneGateway } from './milestone.gateway';
import { MilestoneScheduler } from './milestone.scheduler';
import { MilestoneController } from './milestone.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Milestone])],
  controllers: [MilestoneController],
  providers: [MilestoneService, MilestoneGateway, MilestoneScheduler],
})
export class MilestoneModule {
  constructor(private readonly scheduler: MilestoneScheduler) {
    this.scheduler.startSchedules(); // Start scheduled tasks
  }
}
