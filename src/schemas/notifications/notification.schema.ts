// src/notifications/notification.model.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../project/project.schema'; // Assuming the Project model exists
import { User } from '../user/user.schema';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.notification)
  project: Project;

  @ManyToOne(() => User, (user) => user.notification)
  user: User;

  @Column()
  type: string; // Type of notification, e.g., status, approval, etc.

  @Column()
  value: string; // The message or value of the notification

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
