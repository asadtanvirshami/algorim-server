import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.schema';

@Entity()
export class ProjectInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.projectInfos, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ type: 'varchar', nullable: true })
  meeting_link: string;

  @Column({ type: 'varchar', nullable: true })
  slack: string;

  @Column({ type: 'varchar', nullable: true })
  jira: string;

  @Column({ type: 'varchar', nullable: true })
  trello: string;

  @Column({ type: 'varchar', nullable: true })
  github: string;

  @Column({ type: 'varchar', nullable: true })
  project_manager_name: string;

  @Column({ type: 'varchar', nullable: true })
  project_manager_email: string;

  @Column({ type: 'varchar', nullable: true })
  project_manager_phone: string;

  @Column({ type: 'int', default: 0, nullable: true })
  completion_percentage: number;

  @Column({ type: 'text' })
  note: string;
}
