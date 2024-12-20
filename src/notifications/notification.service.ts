import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Notification } from '../schemas/notifications/notification.schema';
import { NotificationGateway } from './notify.gateway'; // Import the gateway

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationGateway: NotificationGateway, // Inject the gateway
  ) {}

  // Create Notifications in Bulk
  async createNotificationsInBulk(
    notifications: {
      type: 'status' | 'approval' | 'active' | 'completion';
      projectId: string;
      userId: string;
      value: string | boolean;
    }[],
  ): Promise<Notification[]> {
    const notificationEntities = notifications.map((n) =>
      this.notificationRepository.create({
        type: n.type,
        project: { id: parseInt(n.projectId) },
        value: n.value.toString(),
        user: { id: n.userId },
      }),
    );

    const savedNotifications =
      await this.notificationRepository.save(notificationEntities);

    // Emit real-time updates for each notification
    savedNotifications.forEach((notification) => {
      this.notificationGateway.sendProjectUpdate(
        notification.type as 'status' | 'approval' | 'active' | 'completion',
        notification.project.id.toString(),
        notification.value,
      );
    });

    return savedNotifications;
  }

  // Delete Notifications in Bulk by IDs
  async deleteNotificationsInBulk(
    ids: string[],
  ): Promise<{ deletedCount: number }> {
    const result = await this.notificationRepository.delete({ id: In(ids) });
    return { deletedCount: result.affected || 0 };
  }

  // Get Notifications by User ID
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    console.log(userId);
    
    return this.notificationRepository.find({
      where: { user: { id: userId } },
    });
  }
}