import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../services/services.schema';
import { ProjectInfo } from './project-info.schema';
import { Milestone } from './milestone.schema';
import { User } from '../user/user.schema';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  budget: number;

  @Column({ type: 'varchar', default: 'on hold' })
  status: string;

  @Column({ type: 'varchar', unique: true })
  serial_number: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @ManyToOne(() => User, (user) => user.projects)
  user: User; //

  @OneToMany(() => Service, (service) => service.project)
  services: Service[];

  @OneToMany(() => ProjectInfo, (projectInfo) => projectInfo.project)
  projectInfos: ProjectInfo[];

  @OneToMany(() => Milestone, (milestone) => milestone.project, {
    cascade: true,
  })
  milestones: Milestone[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
