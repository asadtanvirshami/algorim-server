import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';

import { User } from './schemas/user/user.schema';
import { Project } from './schemas/project/project.schema';
import { ProjectInfo } from './schemas/project/project-info.schema';
import { Service } from './schemas/services/services.schema';
import { Milestone } from './schemas/project/milestone.schema';

@Module({
  imports: [
    // MongoDB connection
    MongooseModule.forRoot(
      'mongodb+srv://asadworkemail:h5qjrZuhnwc1EoNz@cluster0.qy1ig6y.mongodb.net/',
    ),
    // CockroachDB connection with SSL configuration
    TypeOrmModule.forRoot({
      type: 'cockroachdb',
      url: 'postgresql://algorimsoftware:H7TcL3xD21fsOY_k3AHaEQ@sparse-mummy-7987.8nk.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb',
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false, // This is necessary for self-signed certificates or when not using a custom CA.
        },
      },
      synchronize: true,
      entities: [User, Project, ProjectInfo, Service, Milestone],
    }),
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
