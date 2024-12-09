import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';


import { Project } from 'src/schemas/project/project.schema';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { Service } from 'src/schemas/services/services.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Milestone } from 'src/schemas/milestone/milestone.schema';
import { Document } from 'src/schemas/documents/document.schema';
import { NotificationGateway } from 'src/notifications/notify.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectInfo, Service, Document,Milestone]), // Use TypeORM to manage User entity
    EmailModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, NotificationGateway],
})
export class ProjectModule {}
