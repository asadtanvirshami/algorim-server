import { FindOneOptions, Repository, DataSource } from 'typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectCreationDto, ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationGateway } from 'src/notifications/notify.gateway';

import { Project } from 'src/schemas/project/project.schema';
import { Milestone } from 'src/schemas/milestone/milestone.schema';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { Service } from 'src/schemas/services/services.schema';
import { Document } from 'src/schemas/documents/document.schema';
import { User } from 'src/schemas/user/user.schema';
import { EmailService } from 'src/email/email.service';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    private readonly notificationGateway: NotificationGateway,
    private readonly emailService: EmailService,
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
  async create(projectDto: ProjectCreationDto): Promise<Project> {
    const { title, description, budget, services, userId, deadline } =
      projectDto;
    console.log(projectDto);

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
    const newProject = await this.projectRepository.create({
      title,
      description,
      budget,
      deadline,
      serial_number: `#${serial_number}`,
      user: { id: userId },
    });
    if (newProject) {
      const savedProject = await this.projectRepository.save(newProject);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      await Promise.all(
        services.map((service) => {
          this.servicesRepository.insert({
            service_name: service?.name,
            project: { id: savedProject?.id },
          });
        }),
      );
      if (user) {
        const emailSubject = newProject?.title;
        const emailRecipient = `${user?.email}`; // Replace with the actual recipient
        const emailText = `A new project titled "${newProject.title}" has been created successfully.`;
        const emailHtml = `<p>Dear Esteemed Customer,</p>
        <p>We are pleased to inform you that we have received your project submission successfully. Your project has been assigned the code <strong>${newProject.serial_number}</strong>. Our dedicated team will meticulously review the provided details.</p>
        <p>Below is a summary of the project details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Title</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${newProject.title}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Deadline</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${newProject.deadline}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Budget</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${newProject.budget}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">code</th>
            <td style="border: 1px solid #ddd; padding: 8px;">${newProject.serial_number}</td>
          </tr>
        </table>
        <p>Rest assured, we will keep you updated on the progress of the review process. Your satisfaction is our utmost priority.</p>
        <p>Thank you for selecting Algorim. We eagerly anticipate the opportunity to collaborate with you!</p>
        <p>Best Regards,</p>
        <p>The Algorim Team</p>`;

        try {
          await this.emailService.sendEmail(
            emailRecipient,
            emailSubject,
            emailText,
            emailHtml,
          );
          console.log('Email sent successfully');
        } catch (error) {
          console.log('Failed to send email', error);
        }
      }
    }
    try {
      return newProject;
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
