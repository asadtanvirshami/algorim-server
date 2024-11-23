import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from '../project/project.schema';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Project, (project) => project.documents, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'string', default: null })
  link: string;
  @Column({ type: 'string', default: null })
  file_Id: string;
}
