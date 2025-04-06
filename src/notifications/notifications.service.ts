import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { Prisma } from '@prisma/client';

// Define notification types as constants
export const NotificationTypes = {
  LEAD_ASSIGNED: 'LEAD_ASSIGNED',
  ITINERARY_CREATED: 'ITINERARY_CREATED',
  ITINERARY_UPDATED: 'ITINERARY_UPDATED',
  TASK_DUE: 'TASK_DUE',
  SYSTEM: 'SYSTEM',
} as const;

// Type definition
export type NotificationType = (typeof NotificationTypes)[keyof typeof NotificationTypes];

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(userId: string, type: NotificationType, title: string, message: string, data?: any) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: type as any, // Cast to any to avoid type issues with Prisma
        title,
        message,
        data: data ? JSON.stringify(data) : undefined,
      },
    });

    // Send real-time notification
    await this.notificationsGateway.sendNotification(userId, notification);

    return notification;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async findUnread(userId: string) {
    return this.prisma.notification.findMany({
      where: { 
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { 
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async sendItineraryUpdate(userId: string, itineraryId: string, message: string) {
    return this.create(
      userId,
      NotificationTypes.ITINERARY_UPDATED,
      'Itinerary Update',
      message,
      { itineraryId }
    );
  }

  async sendDocumentProcessed(userId: string, documentId: string) {
    return this.create(
      userId,
      NotificationTypes.SYSTEM,
      'Document Processed',
      'Your document has been processed successfully',
      { documentId }
    );
  }

  async sendFeedbackReceived(userId: string, itineraryId: string) {
    return this.create(
      userId,
      NotificationTypes.SYSTEM,
      'New Feedback',
      'You have received new feedback on your itinerary',
      { itineraryId }
    );
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: type as any, // Cast to any to avoid type issues with Prisma
        title,
        message,
        data: data ? JSON.stringify(data) : undefined,
      },
    });
  }
} 