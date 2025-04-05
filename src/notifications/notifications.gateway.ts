import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');
  private userSockets: Map<string, Socket> = new Map();

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client);
      this.logger.log(`Client connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`Client disconnected: ${userId}`);
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    this.userSockets.set(userId, client);
    this.logger.log(`User joined: ${userId}`);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, userId: string) {
    this.userSockets.delete(userId);
    this.logger.log(`User left: ${userId}`);
  }

  async sendNotification(userId: string, notification: any) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification', notification);
    }
  }

  async sendToAll(notification: any) {
    this.server.emit('notification', notification);
  }
} 