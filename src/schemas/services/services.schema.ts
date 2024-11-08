import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from '../project/project.schema';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Project, (project) => project.services, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ type: 'varchar', length: 100 })
  service_name: string;
}
