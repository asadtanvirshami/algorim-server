import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from 'src/schemas/milestone/milestone.schema';
import { MilestoneDto } from './milestone.dto';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  async getOne(milestoneDto: MilestoneDto): Promise<Milestone | null> {
    const { title, description, isCompleted, project, amount, dueDate } =
      milestoneDto;

    const query: any = {
      where: {},
      order: { createdAt: 'ASC' },
    };

    if (project) query.where.project = project;
    if (isCompleted !== undefined) query.where.isCompleted = isCompleted;
    if (dueDate) query.where.dueDate = dueDate;

    return await this.milestoneRepository.findOne(query);
  }

  async getAll(projectId: string): Promise<Milestone[]> {
    return await this.milestoneRepository.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'ASC' },
    });
  }

  async create(milestoneDto: MilestoneDto): Promise<Milestone> {
    const { title, description, isCompleted, project, amount, dueDate } =
      milestoneDto;

    const newMilestone = this.milestoneRepository.create({
      title,
      description,
      isCompleted,
      project: { id: project },
      amount,
      dueDate,
    });

    try {
      return await this.milestoneRepository.save(newMilestone);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create milestone. Please try again later.',
      );
    }
  }

  async update(id: string, milestoneDto: MilestoneDto): Promise<Milestone> {
    const existingMilestone = await this.milestoneRepository.findOne({
      where: { project: { id } },
    });

    if (!existingMilestone) {
      throw new ConflictException('Milestone not found.');
    }

    Object.assign(existingMilestone, milestoneDto);

    try {
      return await this.milestoneRepository.save(existingMilestone);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update milestone. Please try again later.',
      );
    }
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.milestoneRepository.delete(id);

    if (!deleteResult.affected) {
      throw new ConflictException('Milestone not found.');
    }
  }
}
