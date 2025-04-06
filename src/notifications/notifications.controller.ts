import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({ status: 200, description: 'Return all notifications' })
  getNotifications(@Body('userId') userId: string) {
    return this.notificationsService.getNotifications(userId);
  }

  @Put(':id/read')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(
    @Param('id') notificationId: string,
    @User('id') userId: string,
  ) {
    // First validate that the notification belongs to the user
    const notification = await this.notificationsService.findOne(notificationId);
    
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    
    // Now just pass the ID to the mark as read method
    return this.notificationsService.markAsRead(notificationId);
  }

  @Put('read-all')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  markAllAsRead(@Body('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  deleteNotification(
    @Param('id') notificationId: string,
    @Body('userId') userId: string,
  ) {
    return this.notificationsService.deleteNotification(notificationId, userId);
  }
} 