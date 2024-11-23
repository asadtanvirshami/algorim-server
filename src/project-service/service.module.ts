import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicesService } from './service.service';
import { Service } from 'src/schemas/services/services.schema';
import { ServicesController } from './service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]), // Use TypeORM to manage User entity
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServiceModule {}
