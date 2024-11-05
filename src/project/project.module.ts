import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM module

import { Project } from 'src/schemas/project/project.schema';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]), // Use TypeORM to manage User entity
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class AuthModule {}
