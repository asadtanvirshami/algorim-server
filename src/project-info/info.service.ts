import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { projectInfoDto } from './info.dto';

@Injectable()
export class infoService {
  constructor(
    @InjectRepository(ProjectInfo)
    private readonly infoRepository: Repository<ProjectInfo>,
  ) {}

  async getAll(): Promise<ProjectInfo[]> {
    return await this.infoRepository.find();
  }

  async getOne(infoId: number): Promise<ProjectInfo> {
    const info = await this.infoRepository.findOne({
      where: { id: infoId },
      relations: ['project'], // Ensure the related project is loaded
    });
    if (!info) {
      throw new NotFoundException(`Info with ID ${info} not found.`);
    }
    return info;
  }
  async create(projectInfoDto: projectInfoDto): Promise<ProjectInfo> {
    const newInfo = this.infoRepository.create({
      ...projectInfoDto,
      project: { id: projectInfoDto.project }, // Ensure 'project' is an object
    });

    try {
      return await this.infoRepository.save(newInfo);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create info. Please try again later.',
      );
    }
  }
  async update(
    infoId: number,
    projectInfoDto: projectInfoDto,
  ): Promise<ProjectInfo> {
    const existingInfo = await this.getOne(infoId); // Ensure the service exists

    // Map DTO fields, handling nested relations explicitly
    const updatedInfoData = {
      ...existingInfo,
      ...projectInfoDto,
      project: { id: projectInfoDto.project }, // Convert project ID to an object
    };

    await this.infoRepository.save(updatedInfoData); // Save the updated entity
    return this.getOne(infoId); // Return the updated service
  }

  async delete(infoId: number): Promise<void> {
    const deleteResult = await this.infoRepository.delete(infoId);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Info with ID ${infoId} not found.`);
    }
  }
}
