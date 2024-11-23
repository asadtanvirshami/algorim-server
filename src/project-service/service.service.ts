import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from 'src/schemas/services/services.schema';
import { projectServiceDto } from './service.dto'; // Define this DTO accordingly

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async getAll(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async getOne(serviceId: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['project'], // Ensure the related project is loaded
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }
    return service;
  }
  async create(serviceDto: projectServiceDto): Promise<Service> {
    const newService = this.serviceRepository.create({
      ...serviceDto,
      project: { id: serviceDto.project }, // Ensure 'project' is an object
    });

    try {
      return await this.serviceRepository.save(newService);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create service. Please try again later.',
      );
    }
  }
  async update(
    serviceId: number,
    serviceDto: projectServiceDto,
  ): Promise<Service> {
    const existingService = await this.getOne(serviceId); // Ensure the service exists

    // Map DTO fields, handling nested relations explicitly
    const updatedServiceData = {
      ...existingService,
      ...serviceDto,
      project: { id: serviceDto.project }, // Convert project ID to an object
    };

    await this.serviceRepository.save(updatedServiceData); // Save the updated entity
    return this.getOne(serviceId); // Return the updated service
  }

  async delete(serviceId: number): Promise<void> {
    const deleteResult = await this.serviceRepository.delete(serviceId);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }
  }
}
