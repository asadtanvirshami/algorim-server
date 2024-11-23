import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadGatewayException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentDto } from './document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDocumentDto: DocumentDto,
    @UploadedFile() file: multer.File,
  ) {
    // Debugging logs
    console.log('Received DTO:', createDocumentDto);
    console.log('Received File:', file);

    // Validate that required fields are present
    if (!createDocumentDto.name || !createDocumentDto.project || !file) {
      throw new BadGatewayException(
        'Missing required fields: name, projectId, or file.',
      );
    }

    // Call service to handle document creation
    return this.documentService.createDocument(
      createDocumentDto,
      file.buffer.toString('base64'),
    );
  }

  // Delete document (remove image from ImageKit)
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
