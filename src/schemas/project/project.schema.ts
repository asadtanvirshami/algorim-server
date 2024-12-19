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
import { Milestone } from '../milestone/milestone.schema';
import { User } from '../user/user.schema';
import { Document } from '../documents/document.schema';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  budget: number;

  @Column({ type: 'varchar', default: 'on hold' })
  status: string;

  @Column({ type: 'varchar', default: 'on hold' })
  phase: string;

  @Column({ type: 'varchar', unique: true })
  serial_number: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'date', default: null })
  start_date: Date;

  @Column({ type: 'date', default: null })
  end_date: Date;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @OneToMany(() => Service, (service) => service.project, { cascade: true })
  services: Service[];

  @OneToMany(() => Document, (document) => document.project)
  documents: Document[];

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
