import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../project/project.schema';
@Entity()
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Project, (project) => project.milestones, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
