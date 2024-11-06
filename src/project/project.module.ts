import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM module

import { Project } from 'src/schemas/project/project.schema';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { Service } from 'src/schemas/services/services.schema';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectInfo, Service]), // Use TypeORM to manage User entity
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
