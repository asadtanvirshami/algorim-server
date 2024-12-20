import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { MilestoneModule } from './milestone/milestone.module';
import { EmailModule } from './email/email.module';

import { User } from './schemas/user/user.schema';
import { Project } from './schemas/project/project.schema';
import { ProjectInfo } from './schemas/project/project-info.schema';
import { Service } from './schemas/services/services.schema';
import { Document } from './schemas/documents/document.schema';
import { Milestone } from './schemas/milestone/milestone.schema';
import { ServiceModule } from './project-service/service.module';
import { InfoModule } from './project-info/info.module';
import { DocModule } from './document/document.module';
import { NotificationGateway } from './notifications/notify.gateway';
import { NotificationModule } from './notifications/notification.module';
import { Notification } from './schemas/notifications/notification.schema';

@Module({
  providers: [NotificationGateway],
  imports: [
    // MongoDB connection
    MongooseModule.forRoot(
      'mongodb+srv://asadworkemail:h5qjrZuhnwc1EoNz@cluster0.qy1ig6y.mongodb.net/',
    ),
    // CockroachDB connection with SSL configurationn
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
      entities: [User, Project,Notification, ProjectInfo, Service, Milestone, Document],
    }),
    AuthModule,
    ProjectModule,
    MilestoneModule,
    EmailModule,
    ServiceModule,
    DocModule,
    InfoModule,
    NotificationModule
  ],
  controllers: [],
})
export class AppModule {}
