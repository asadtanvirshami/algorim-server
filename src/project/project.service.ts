import { Project } from 'src/schemas/project/project.schema';
import { Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(projectDto: ProjectDto): Promise<Project> {
    const { title, description, budget, status, deadline, approved } =
      projectDto;

    const serial_number = Math.floor(100 + Math.random() * 9000);
    // Validate serial_number for uniqueness
    const existingProject = await this.projectRepository.findOne({
      where: { serial_number: `${serial_number}` },
    });
    if (existingProject) {
      throw new ConflictException(
        'A project with this serial number already exists.',
      );
    }

    // Create a new project instance
    const newProject = this.projectRepository.create({
      title,
      description,
      budget,
      status,
      serial_number: `#${serial_number}`,
      deadline,
      approved,
    });

    try {
      // Save the new project to the database
      return await this.projectRepository.save(newProject);
    } catch (error) {
      // Handle unexpected errors
      throw new InternalServerErrorException(
        'Failed to create project. Please try again later.',
      );
    }
  }
}
