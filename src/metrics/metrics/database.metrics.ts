import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatabaseMetricsService {
  constructor(private prisma: PrismaService) {}

  async getLeadMetrics() {
    const totalLeads = await this.prisma.lead.count();
    const processedLeads = await this.prisma.lead.count({
      where: {
        status: {
          notIn: ['NEW']
        }
      },
    });

    return {
      totalLeads,
      processedLeads,
      processingRate: totalLeads > 0 ? (processedLeads / totalLeads) * 100 : 0,
    };
  }

  async getItineraryMetrics() {
    const totalItineraries = await this.prisma.itinerary.count();
    const publishedItineraries = await this.prisma.itinerary.count({
      where: {
        status: 'APPROVED'
      },
    });

    return {
      totalItineraries,
      publishedItineraries,
      publishRate: totalItineraries > 0 ? (publishedItineraries / totalItineraries) * 100 : 0,
    };
  }

  async getUserMetrics() {
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: {
        isActive: true,
      },
    });

    return {
      totalUsers,
      activeUsers,
      activeRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    };
  }

  async getNotificationMetrics() {
    const totalNotifications = await this.prisma.notification.count();
    const unreadNotifications = await this.prisma.notification.count({
      where: {
        isRead: false,
      },
    });

    return {
      totalNotifications,
      unreadNotifications,
      readRate: totalNotifications > 0 ? ((totalNotifications - unreadNotifications) / totalNotifications) * 100 : 0,
    };
  }
} 