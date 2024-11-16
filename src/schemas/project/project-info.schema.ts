import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.schema';

interface Link {
  url: string;
  description: string;
}
@Entity()
export class ProjectInfo {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Project, (project) => project.projectInfos, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ type: 'varchar', nullable: true })
  meeting_link: string;

  @Column({ type: 'jsonb', nullable: true })
  links: Link[];

  @Column({ type: 'varchar', nullable: true })
  project_manager_name: string;

  @Column({ type: 'varchar', nullable: true })
  project_manager_email: string;

  @Column({ type: 'varchar', nullable: true })
  project_manager_phone: string;

  @Column({ type: 'float', default: 0, nullable: true })
  completion_percentage: number;

  @Column({ type: 'text' })
  note: string;
}
