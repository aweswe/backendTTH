import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { AiModule } from './ai/ai.module';
import { PdfModule } from './pdf/pdf.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CustomerPortalModule } from './customer-portal/customer-portal.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from './bull/bull.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BullModule,
    AuthModule,
    UsersModule,
    LeadsModule,
    ItineraryModule,
    AiModule,
    PdfModule,
    AnalyticsModule,
    CustomerPortalModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
