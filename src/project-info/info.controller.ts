import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { projectInfoDto } from './info.dto';
import { infoService } from './info.service';

@Controller('project-info') // Base route for the service
export class infoController {
  constructor(private readonly infoService: infoService) {}

  @Get('get')
  async getAllInfo() {
    return await this.infoService.getAll();
  }

  @Get('get/:id')
  async getInfo(@Param('id') id: number) {
    try {
      return await this.infoService.getOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('create')
  async createInfo(@Body() projectInfoDto: projectInfoDto) {
    return await this.infoService.create(projectInfoDto);
  }

  @Put('update/:id')
  async updateInfo(
    @Param('id') id: number,
    @Body() projectInfoDto: projectInfoDto,
  ) {
    try {
      return await this.infoService.update(id, projectInfoDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('delete/:id')
  async deleteInfo(@Param('id', ParseUUIDPipe) id: number) {
    try {
      await this.infoService.delete(id);
      return { message: 'Info deleted successfully.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
