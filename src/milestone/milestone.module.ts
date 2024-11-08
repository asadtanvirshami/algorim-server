import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM module

import { Milestone } from './../schemas/milestone/milestone.schema';

import { MilestoneController } from './milestone.controller';
import { MilestoneService } from './milestone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone]), // Use TypeORM to manage User entity
  ],
  controllers: [MilestoneController],
  providers: [MilestoneService],
})
export class MilestoneModule {}
