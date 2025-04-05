import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
      },
    });

    // Send real-time notification
    await this.notificationsGateway.sendNotification(data.userId, notification);

    return notification;
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.delete({
      where: { id: notificationId, userId },
    });
  }

  async sendItineraryUpdate(userId: string, itineraryId: string, message: string) {
    return this.createNotification({
      userId,
      type: 'ITINERARY_UPDATE',
      title: 'Itinerary Update',
      message,
      data: { itineraryId },
    });
  }

  async sendDocumentProcessed(userId: string, documentId: string) {
    return this.createNotification({
      userId,
      type: 'DOCUMENT_PROCESSED',
      title: 'Document Processed',
      message: 'Your document has been processed successfully',
      data: { documentId },
    });
  }

  async sendFeedbackReceived(userId: string, itineraryId: string) {
    return this.createNotification({
      userId,
      type: 'FEEDBACK_RECEIVED',
      title: 'New Feedback',
      message: 'You have received new feedback on your itinerary',
      data: { itineraryId },
    });
  }
} 