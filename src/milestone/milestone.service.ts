import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from 'src/schemas/milestone/milestone.schema';
import { MilestoneDto } from './milestone.dto';
import { MilestoneGateway } from './milestone.gateway';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    private readonly milestoneGateway: MilestoneGateway,
  ) {}

  async getAll(milestoneDto: MilestoneDto): Promise<Milestone | null> {
    const { isCompleted, project, amount, dueDate } = milestoneDto;

    const query: any = {
      where: {},
      order: { createdAt: 'ASC' },
    };

    if (amount) query.where.amount = amount;
    if (project) query.where.project = project;
    if (isCompleted !== undefined) query.where.isCompleted = isCompleted;
    if (dueDate) query.where.dueDate = dueDate;

    return await this.milestoneRepository.findOne(query);
  }

  async getOne(milestoneId: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId },
      relations: ['project'], // Ensure the related project is loaded
    });
    if (!milestone) {
      throw new NotFoundException(`Info with ID ${milestone} not found.`);
    }
    return milestone;
  }

  async create(milestoneDto: MilestoneDto): Promise<Milestone> {
    const newMilestone = this.milestoneRepository.create({
      ...milestoneDto,
      project: { id: milestoneDto.project },
    });

    try {
      return await this.milestoneRepository.save(newMilestone);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Failed to create milestone. Please try again later.',
      );
    }
  }

  async update(
    milestoneId: number,
    milestoneDto: MilestoneDto,
  ): Promise<Milestone> {
    const existingMilestone = await this.getOne(milestoneId);

    const updatedMilestoneData = {
      ...existingMilestone,
      ...milestoneDto,
      project: { id: milestoneDto.project },
    };

    await this.milestoneRepository.save(updatedMilestoneData);
    this.milestoneGateway.notifyMilestoneUpdate(
      'milestoneUpdated',
      updatedMilestoneData,
    );
    if (updatedMilestoneData.isCompleted === true) {
      this.milestoneGateway.notifyMilestoneUpdate(
        'milestoneCompleted',
        milestoneDto,
      );
    }
    return this.getOne(milestoneId);
  }

  async checkDueDates() {
    const milestones = await this.milestoneRepository.find(); // Adjust the query as needed

    milestones.forEach((milestone) => {
      const today = new Date();
      const dueDate = new Date(milestone.dueDate); // Ensure dueDate field exists

      if (dueDate.getTime() === today.getTime()) {
        this.milestoneGateway.notifyMilestoneUpdate(
          'milestoneDueToday',
          milestone,
        );
      } else if (
        dueDate.getTime() < today.getTime() &&
        milestone.isCompleted !== true
      ) {
        this.milestoneGateway.notifyMilestoneUpdate(
          'milestoneOverdue',
          milestone,
        );
      }
    });
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.milestoneRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Info with ID ${id} not found.`);
    }
  }
}
