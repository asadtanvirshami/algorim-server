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
import { ServicesService } from './service.service'; // Import the service
import { projectServiceDto } from './service.dto'; // Ensure DTO is correctly defined

@Controller('project-service') // Base route for the service
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Get all services
  @Get('get')
  async getAllServices() {
    return await this.servicesService.getAll();
  }

  // Get a single service by ID
  @Get('get/:id')
  async getService(@Param('id') id: number) {
    try {
      return await this.servicesService.getOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Create a new service
  @Post('create')
  async createService(@Body() serviceDto: projectServiceDto) {
    return await this.servicesService.create(serviceDto);
  }

  // Update an existing service by ID
  @Put('update/:id')
  async updateService(
    @Param('id') id: number,
    @Body() serviceDto: projectServiceDto,
  ) {
    try {
      return await this.servicesService.update(id, serviceDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Delete a service by ID
  @Delete('delete/:id')
  async deleteService(@Param('id', ParseUUIDPipe) id: number) {
    try {
      await this.servicesService.delete(id);
      return { message: 'Service deleted successfully.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
