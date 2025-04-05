import { Module } from '@nestjs/common';
import { OfflineSyncService } from './offline-sync.service';
import { OfflineSyncController } from './offline-sync.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'offline-sync',
    }),
  ],
  providers: [OfflineSyncService],
  controllers: [OfflineSyncController],
  exports: [OfflineSyncService],
})
export class OfflineSyncModule {} 