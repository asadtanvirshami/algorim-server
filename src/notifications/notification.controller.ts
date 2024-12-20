import { Body, Controller, Delete, Post, Get, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '../schemas/notifications/notification.schema';
import { ProjectDto } from 'src/project/project.dto';
import { NotificationGateway } from './notify.gateway';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Get('get')
  async get(@Query('userId') id: string): Promise<Notification[]> {
    console.log(id, 'id_of_user');

    return this.notificationService.getNotificationsByUserId(id);
  }

  @Post('bulk-create')
  async bulkCreateNotifications(
    @Body()
    notifications: {
      type: 'status' | 'approval' | 'active' | 'completion';
      userId: string;
      projectId: string;
      value: string | boolean;
    }[],
  ): Promise<Notification[]> {
    const validatedNotifications = notifications.map((notification) => ({
      ...notification,
      type: notification.type as
        | 'status'
        | 'approval'
        | 'active'
        | 'completion',
    }));
    this.notificationGateway.sendProjectUpdate(
      notifications[0].type,
      notifications[0].projectId,
      notifications[0].value,
    );
    return this.notificationService.createNotificationsInBulk(
      validatedNotifications,
    );
  }

  @Delete('bulk-delete')
  async bulkDeleteNotifications(
    @Body() ids: string[],
  ): Promise<{ deletedCount: number }> {
    return this.notificationService.deleteNotificationsInBulk(ids);
  }
}
