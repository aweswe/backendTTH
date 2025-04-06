import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

interface SyncData {
  deviceId: string;
  operations: Array<{
    type: string;
    data: any;
    timestamp: string;
  }>;
}

@Controller('offline-sync')
@UseGuards(JwtAuthGuard)
export class OfflineSyncController {
  constructor() {}

  @Post('sync')
  async syncOfflineData(
    @User('id') userId: string,
    @Body() data: SyncData
  ) {
    // For now, just return the data as acknowledgment
    return {
      success: true,
      userId,
      syncedData: data
    };
  }
} 