import { FindOneOptions, Repository, DataSource } from 'typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationGateway } from 'src/notifications/notify.gateway';

import { Project } from 'src/schemas/project/project.schema';
import { Milestone } from 'src/schemas/milestone/milestone.schema';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { Service } from 'src/schemas/services/services.schema';
import { Document } from 'src/schemas/documents/document.schema';

@Injectable()
export class ProjectService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Milestone)
    private readonly milestonesRepository: Repository<Milestone>,
    @InjectRepository(ProjectInfo)
    private readonly projectInfosRepository: Repository<ProjectInfo>,
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async getOne(projectDto: ProjectDto): Promise<Project | null> {
    const { id } = projectDto;

    const query: FindOneOptions<Project> = {
      where: {},
      order: { createdAt: 'ASC' as 'ASC' },
      relations: [
        'projectInfos',
        'services',
        'milestones',
        'user',
        'documents',
      ],
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
  async editProject(data: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        project,
        services,
        milestones,
        details,
        documents,
        delete: toDelete,
      } = data;

      // Validate project data
      if (!project || typeof project !== 'object') {
        throw new Error('Invalid or missing project data');
      }

      // Fetch the current project from the database
      const existingProject = await queryRunner.manager.findOne(Project, {
        where: { id: project.id },
      });

      // Upsert Project
      await queryRunner.manager.save(Project, project);

      // Track changes for notifications
      const hasStatusChanged =
        existingProject?.status !== project.status &&
        project.status !== undefined;
      const hasApprovalChanged =
        existingProject?.approved !== project.approved &&
        project.approved !== undefined;
      const hasActiveChanged =
        existingProject?.active !== project.active &&
        project.active !== undefined;
      const hasPercentageChanged =
        Array.isArray(existingProject?.projectInfos) &&
        existingProject.projectInfos.length > 0 &&
        existingProject.projectInfos[0].completion_percentage !==
          project.projectInfos[0].completion_percentage &&
          project.projectInfos[0]?.completion_percentage !== undefined;
      // Helper function for bulk upsert
      const bulkUpsert = async (entityClass, items) => {
        if (Array.isArray(items) && items.length > 0) {
          await queryRunner.manager.save(entityClass, items);
        }
      };
      console.log(hasPercentageChanged);
      
      // Perform bulk upserts
      await Promise.all([
        bulkUpsert(Service, services || []),
        bulkUpsert(Milestone, milestones || []),
        bulkUpsert(ProjectInfo, details || []),
        bulkUpsert(Document, documents || []),
      ]);

      // Helper function for bulk deletion
      const bulkDelete = async (entityClass, ids) => {
        if (Array.isArray(ids) && ids.length > 0) {
          await queryRunner.manager.delete(entityClass, ids);
        }
      };

      // Perform bulk deletions
      await Promise.all([
        bulkDelete(Service, toDelete?.services || []),
        bulkDelete(Milestone, toDelete?.milestones || []),
        bulkDelete(ProjectInfo, toDelete?.details || []),
        bulkDelete(Document, toDelete?.documents || []),
      ]);

      await queryRunner.commitTransaction(); // Commit the transaction

      // Send real-time updates if specific fields have changed
      if (hasStatusChanged) {
        this.notificationGateway.sendProjectUpdate(
          'status',
          project.id,
          project.status,
        );
      }

      if (hasApprovalChanged) {
        this.notificationGateway.sendProjectUpdate(
          'approval',
          project.id,
          project.approved,
        );
      }

      if (hasActiveChanged) {
        this.notificationGateway.sendProjectUpdate(
          'active',
          project.id,
          project.active,
        );
      }

      if (hasPercentageChanged) {
        this.notificationGateway.sendProjectUpdate(
          'completion',
          details.id,
          details.completion_percentage,
        );
      }

      return { status: 'success' };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback on error
      console.error('Transaction error:', error);
      throw new InternalServerErrorException(
        'Transaction failed: ' + error.message,
      );
    } finally {
      await queryRunner.release(); // Release the query runner
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
