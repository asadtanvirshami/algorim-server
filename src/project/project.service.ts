import { Project } from 'src/schemas/project/project.schema';
import { Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectDto, projectInfoDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { Service } from 'src/schemas/services/services.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectInfo)
    private infoRepository: Repository<ProjectInfo>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async getOne(projectDto: ProjectDto): Promise<Project | null> {
    const { status, approved, serial_number } = projectDto;

    // Define a query object to hold dynamic filters
    const query: any = {
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: ProjectInfo,
          where: {},
          include: [{ model: Service }],
        },
      ],
    };

    // Apply filters based on the provided fields
    if (status) query.where = { ...query.where, status };
    if (approved !== undefined) query.where = { ...query.where, approved };
    if (serial_number) {
      query.include[0].where = {
        ...query.include[0].where,
        serial_number: `#${serial_number}`,
      };
    }

    // Retrieve and return a single project matching the filters
    return await this.projectRepository.findOne(query);
  }

  async getAll(projectDto: ProjectDto): Promise<Project[]> {
    const { status, approved, serial_number } = projectDto;

    // Define a query object to hold dynamic filters
    const query: any = {
      where: {},
      order: { createdAt: 'ASC' },
      relations: ['projectInfos', 'services'],
    };

    if (status) query.where.status = status;
    if (approved !== undefined) query.where.approved = approved;
    if (serial_number) {
      query.where['projectInfos.serial_number'] = `#${serial_number}`;
    }

    return await this.projectRepository.find(query);
  }

  async create(projectDto: ProjectDto): Promise<Project> {
    const { title, description, budget, status, deadline, approved, userId } =
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
      user: { id: userId },
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

  async createInfo(infoDto: projectInfoDto): Promise<ProjectInfo> {
    const {
      meeting_link,
      slack,
      jira,
      trello,
      github,
      project_manager_name,
      project_manager_email,
      project_manager_phone,
      completion_percentage,
      note,
      project,
    } = infoDto;

    const newInfo = {
      meeting_link,
      slack,
      jira,
      trello,
      github,
      project_manager_name,
      project_manager_email,
      project_manager_phone,
      completion_percentage,
      note,
      project: { id: project },
    };

    try {
      const infoFounded = await this.infoRepository.findOne({
        where: { project: { id: project } },
      });

      if (infoFounded) {
        await this.infoRepository.update({ project: { id: project } }, newInfo);
        return infoFounded;
      } else {
        const createdInfo = await this.infoRepository.save(newInfo);
        return createdInfo;
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create or update project info. Please try again later.',
      );
    }
  }
}
