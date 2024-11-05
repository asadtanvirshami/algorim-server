import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  private readonly logger = new Logger(ProjectController.name); // Updated logger name to AuthController

  @Post('signup')
  async signUp(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

}
