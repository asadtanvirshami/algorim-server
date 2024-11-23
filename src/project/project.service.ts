import { Project } from 'src/schemas/project/project.schema';
import { FindOneOptions, Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getOne(projectDto: ProjectDto): Promise<Project | null> {
    const { id } = projectDto;

    const query: FindOneOptions<Project> = {
      where: {},
      order: { createdAt: 'ASC' as 'ASC' },
      relations: ['projectInfos', 'services', 'milestones', 'user'],
    };

    query.where['id'] = id;

    return await this.projectRepository.findOne(query);
  }

  async getAll(
    projectDto: ProjectDto,
    page: number = 1,
    limit: number = 8,
  ): Promise<{ data: Project[]; total: number }> {
    const { status, approved, serial_number, userId } = projectDto;

    const query: any = {
      where: {},
      order: { createdAt: 'ASC' },
      relations: ['projectInfos', 'services', 'milestones', 'user'],
      skip: (page - 1) * limit,
      take: limit,
    };

    // Apply filters conditionally
    if (status) query.where.status = status;
    if (approved !== undefined) query.where.approved = approved;
    if (serial_number) {
      query.where['projectInfos.serial_number'] = `#${serial_number}`;
    }
    if (userId) {
      query.where['user.id'] = userId;
    }

    // Fetch data and count in one query
    const [data, total] = await this.projectRepository.findAndCount(query);

    // Transform the data if necessary
    const plainData = data.map((item) => JSON.parse(JSON.stringify(item)));

    return {
      data: plainData,
      total,
    };
  }

  async create(projectDto: ProjectDto): Promise<Project> {
    const {
      title,
      description,
      budget,
      status,
      deadline,
      approved,
      userId,
      start_date,
      end_date,
    } = projectDto;

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
      start_date,
      end_date,
      user: { id: userId },
    });

    try {
      return await this.projectRepository.save(newProject);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create project. Please try again later.',
      );
    }
  }

  async deleteProject(projectId: number): Promise<void> {
    const deleteResult = await this.projectRepository.delete(projectId);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
  }

  async updateProject(
    projectId: number,
    projectUpdateDto: Partial<ProjectDto>,
  ): Promise<Project> {
    const existingProject = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const updatedData = {
      ...existingProject,
      ...projectUpdateDto,
      id: projectId,
    };

    const updatedProject = this.projectRepository.create(updatedData);
    await this.projectRepository.save(updatedProject);

    return updatedProject;
  }
}
