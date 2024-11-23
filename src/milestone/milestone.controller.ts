import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  HttpStatus,
  HttpException,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { MilestoneDto } from './milestone.dto';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly mileStoneService: MilestoneService) {}
  private readonly logger = new Logger(MilestoneController.name); // Updated logger name to AuthController

  @Get('get')
  async get(@Body() mileStoneDto: MilestoneDto) {
    return this.mileStoneService.getAll(mileStoneDto);
  }

  @Post('create')
  async create(@Body() mileStoneDto: MilestoneDto) {
    return this.mileStoneService.create(mileStoneDto);
  }

  @Put('update/:id')
  async updateInfo(
    @Param('id') id: number,
    @Body() mileStoneDto: MilestoneDto,
  ) {
    try {
      return await this.mileStoneService.update(id, mileStoneDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('delete/:id')
  async deleteInfo(@Param('id') id: number) {
    try {
      await this.mileStoneService.delete(id);
      return { message: 'milestone deleted successfully.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
