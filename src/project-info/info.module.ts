import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/schemas/project/project.schema';
import { ProjectInfo } from 'src/schemas/project/project-info.schema';
import { infoController } from './info.controller';
import { infoService } from './info.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectInfo]), // Use TypeORM to manage User entity
  ],
  controllers: [infoController],
  providers: [infoService],
})
export class InfoModule {}
