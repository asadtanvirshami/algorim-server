import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectCreationDto, ProjectDto } from './project.dto';
import { EmailService } from '../email/email.service'; // Import EmailService

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly emailService: EmailService, // Inject EmailService
  ) {}
  private readonly logger = new Logger(ProjectController.name);

  @Get('get')
  async get(
    @Query() projectDto: ProjectDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 8,
    @Res() res
  ) {
    try {
      const result = await this.projectService.getAll(projectDto, page, limit);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'error', message: error.message });
    }
  }

  @Get('get-one')
  async getOne(@Query() projectDto: ProjectDto) {
    return this.projectService.getOne(projectDto);
  }

  @Put('edit')
  async edit(@Body() body: any, @Res() res) {
    try {
      const result = await this.projectService.editProject(body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'error', message: error.message });
    }
  }

  @Post('create')
  async create(@Body() projectDto: ProjectCreationDto, @Res() res) {
    try {
      const result = await this.projectService.create(projectDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'error', message: error.message });
    }
  }

  @Put('delete/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() updateProjectDto: ProjectDto,
    @Res() res
  ) {
   
    try {
      const result = await this.projectService.updateProject(id, updateProjectDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'error', message: error.message });
    }
  }
}
