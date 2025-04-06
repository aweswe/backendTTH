import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;
  let gateway: NotificationsGateway;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockNotificationsGateway = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsGateway, useValue: mockNotificationsGateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
    gateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification and send it via gateway', async () => {
      const mockNotification = {
        id: 'notification-1',
        userId: 'user-1',
        type: 'LEAD_ASSIGNED',
        title: 'New Lead',
        message: 'You have been assigned a new lead',
        data: JSON.stringify({ leadId: 'lead-1' }),
      };

      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.create(
        'user-1',
        'LEAD_ASSIGNED',
        'New Lead',
        'You have been assigned a new lead',
        { leadId: 'lead-1' }
      );

      expect(result).toEqual(mockNotification);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'LEAD_ASSIGNED',
          title: 'New Lead',
          message: 'You have been assigned a new lead',
          data: JSON.stringify({ leadId: 'lead-1' }),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all notifications for a user', async () => {
      const mockNotifications = [
        {
          id: 'notification-1',
          userId: 'user-1',
          type: 'LEAD_ASSIGNED',
          title: 'New Lead',
          message: 'You have been assigned a new lead',
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);

      const result = await service.findAll('user-1');

      expect(result).toEqual(mockNotifications);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findUnread', () => {
    it('should return unread notifications for a user', async () => {
      const mockNotifications = [
        {
          id: 'notification-1',
          userId: 'user-1',
          type: 'LEAD_ASSIGNED',
          title: 'New Lead',
          message: 'You have been assigned a new lead',
          isRead: false,
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);

      const result = await service.findUnread('user-1');

      expect(result).toEqual(mockNotifications);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const mockUpdatedNotification = {
        id: 'notification-1',
        isRead: true,
      };

      mockPrismaService.notification.update.mockResolvedValue(mockUpdatedNotification);

      const result = await service.markAsRead('notification-1');

      expect(result).toEqual(mockUpdatedNotification);
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
        data: { isRead: true },
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for a user', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.markAllAsRead('user-1');

      expect(result).toEqual({ count: 2 });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
        data: { isRead: true },
      });
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      mockPrismaService.notification.delete.mockResolvedValue({ id: 'notification-1' });

      await service.remove('notification-1');

      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
      });
    });
  });

  describe('sendItineraryUpdate', () => {
    it('should send an itinerary update notification', async () => {
      const mockNotification = {
        id: 'notification-1',
        userId: 'user-1',
        type: 'ITINERARY_UPDATED',
        title: 'Itinerary Update',
        message: 'Your itinerary has been updated',
        data: JSON.stringify({ itineraryId: 'itinerary-1' }),
      };

      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.sendItineraryUpdate(
        'user-1',
        'itinerary-1',
        'Your itinerary has been updated',
      );

      expect(result).toEqual(mockNotification);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'ITINERARY_UPDATED',
          title: 'Itinerary Update',
          message: 'Your itinerary has been updated',
          data: JSON.stringify({ itineraryId: 'itinerary-1' }),
        },
      });
      expect(mockNotificationsGateway.sendNotification).toHaveBeenCalledWith('user-1', mockNotification);
    });
  });
});