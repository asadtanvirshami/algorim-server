import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document } from 'src/schemas/documents/document.schema';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]), // Use TypeORM to manage User entity
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocModule {}
