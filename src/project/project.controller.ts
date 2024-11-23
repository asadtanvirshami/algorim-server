import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './project.dto';
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
  ) {
    return this.projectService.getAll(projectDto, page, limit);
  }

  @Get('get-one')
  async getOne(@Query() projectDto: ProjectDto) {
    return this.projectService.getOne(projectDto);
  }

  @Post('create')
  async create(@Body() projectDto: ProjectDto) {
    const project = await this.projectService.create(projectDto);

    // // Send an email notification
    // const emailSubject = 'New Project Created';
    // const emailRecipient = 'recipient@example.com'; // Replace with the actual recipient
    // const emailText = `A new project titled "${projectDto.title}" has been created successfully.`;
    // const emailHtml = `<p>Dear Esteemed Customer,</p>
    // <p>We are pleased to inform you that we have received your project submission successfully. Your project has been assigned the code <strong>${projectDto.serial_number}</strong>. Our dedicated team will meticulously review the provided details.</p>
    // <p>Below is a summary of the project details:</p>
    // <table style="border-collapse: collapse; width: 100%;">
    //   <tr>
    //     <th style="border: 1px solid #ddd; padding: 8px;">Title</th>
    //     <td style="border: 1px solid #ddd; padding: 8px;">${projectDto.title}</td>
    //   </tr>
    //   <tr>
    //     <th style="border: 1px solid #ddd; padding: 8px;">Deadline</th>
    //     <td style="border: 1px solid #ddd; padding: 8px;">${projectDto.deadline}</td>
    //   </tr>
    //   <tr>
    //     <th style="border: 1px solid #ddd; padding: 8px;">Budget</th>
    //     <td style="border: 1px solid #ddd; padding: 8px;">${projectDto.budget}</td>
    //   </tr>
    //   <tr>
    //     <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
    //     <td style="border: 1px solid #ddd; padding: 8px;">${projectDto.description}</td>
    //   </tr>
    //   <tr>
    //     <th style="border: 1px solid #ddd; padding: 8px;">code</th>
    //     <td style="border: 1px solid #ddd; padding: 8px;">${projectDto.serial_number}</td>
    //   </tr>
    // </table>
    // <p>Rest assured, we will keep you updated on the progress of the review process. Your satisfaction is our utmost priority.</p>
    // <p>Thank you for selecting Algorim. We eagerly anticipate the opportunity to collaborate with you!</p>
    // <p>Best Regards,</p>
    // <p>The Algorim Team</p>`;

    // try {
    //   await this.emailService.sendEmail(
    //     emailRecipient,
    //     emailSubject,
    //     emailText,
    //     emailHtml,
    //   );
    //   this.logger.log('Email sent successfully');
    // } catch (error) {
    //   this.logger.error('Failed to send email', error);
    // }

    return project;
  }

  @Put('delete/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() updateProjectDto: ProjectDto,
  ) {
    return await this.projectService.updateProject(id, updateProjectDto);
  }
}
