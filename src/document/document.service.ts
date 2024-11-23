// src/document/document.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../schemas/documents/document.schema'; // Import the ImageKit service
import { DocumentDto } from './document.dto';
import { deleteImage, uploadImage } from 'src/functions/image-kit';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async createDocument(
    createDocumentDto: DocumentDto,
    file: string,
  ): Promise<Document> {
    const { name, project } = createDocumentDto;

    if (!name || !project || !file) {
      throw new Error('Missing required fields: name, projectId, or file.');
    }

    try {
      const fileName = `${Date.now()}-${name}`;
      const folder = 'documents';

      const uploadedImageUrl = await uploadImage(file, fileName, folder);

      const document = this.documentRepository.create({
        name,
        link: uploadedImageUrl.url,
        project: { id: project },
        file_Id: uploadedImageUrl.fileId,
      });

      return await this.documentRepository.save(document);
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async deleteDocument(documentId: number): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new Error('Document not found');
    }

    try {
      const fileId = document.file_Id;
      await deleteImage(fileId);

      await this.documentRepository.delete(documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}
