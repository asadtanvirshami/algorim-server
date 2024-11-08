import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import {
  MilestoneDto,
} from './milestone.dto';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly mileStoneService: MilestoneService) {}
  private readonly logger = new Logger(MilestoneController.name); // Updated logger name to AuthController

  @Get('get')
  async get(@Body() mileStoneDto: MilestoneDto) {
    return this.mileStoneService.getAll(mileStoneDto.project);
  }
  @Post('create')
  async create(@Body() mileStoneDto: MilestoneDto) {
    return this.mileStoneService.create(mileStoneDto);
  }
}
