import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto, projectInfoDto, projectServiceDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  private readonly logger = new Logger(ProjectController.name); // Updated logger name to AuthController

  @Get('get')
  async get(@Body() projectDto: ProjectDto) {
    return this.projectService.getAll(projectDto);
  }

  @Post('create')
  async create(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

  @Post('create-info')
  async createInfo(@Body() infoDto: projectInfoDto) {
    return this.projectService.createInfo(infoDto);
  }

  @Post('create-service')
  async createService(@Body() projectServiceDto: projectServiceDto) {
    return this.projectService.createService(projectServiceDto);
  }
}
