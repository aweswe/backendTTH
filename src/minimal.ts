import { NestFactory } from '@nestjs/core';
import { Module, INestApplication, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// Import controllers and modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsController } from './metrics/metrics.controller';

import { LeadsModule } from './leads/leads.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PdfModule } from './pdf/pdf.module';
import { PdfThemeModule } from './pdf-theme/pdf-theme.module';
import { OfflineSyncModule } from './offline-sync/offline-sync.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { MetricsModule } from './metrics/metrics.module';
import { DatabaseModule } from './database/database.module';
import { AiModule } from './ai/ai.module';
import { CustomerPortalModule } from './customer-portal/customer-portal.module';
import { CommunicationModule } from './communication/communication.module';
import { BullModule } from './bull/bull.module';
import { ConfigModule } from './config/config.module';
import { MockPrismaService } from './auth/auth.service';

// Mock Service (for testing without database)
class MockService {
  private items = new Map();

  async findAll() {
    return Array.from(this.items.values());
  }

  async findOne(id: string) {
    return this.items.get(id);
  }

  async create(data: any) {
    const id = Date.now().toString();
    this.items.set(id, { id, ...data });
    return this.items.get(id);
  }

  async update(id: string, data: any) {
    const item = this.items.get(id);
    if (!item) return null;
    const updated = { ...item, ...data };
    this.items.set(id, updated);
    return updated;
  }

  async remove(id: string) {
    const item = this.items.get(id);
    this.items.delete(id);
    return item;
  }
}

// Mock Controllers
@Controller('leads')
@ApiTags('Leads')
class MockLeadsController {
  constructor(private service: MockService) {}

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create lead' })
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

// Similar mock controllers for other modules...
@Controller('auth')
@ApiTags('Authentication')
class MockAuthController {
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: any) {
    return {
      access_token: 'mock_jwt_token',
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'admin'
      }
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  async register(@Body() registerDto: any) {
    return {
      id: Date.now().toString(),
      ...registerDto
    };
  }
}

@Module({
  imports: [
    LeadsModule,
    AuthModule,
    UsersModule,
    ItineraryModule,
    AnalyticsModule,
    NotificationsModule,
    PdfModule,
    PdfThemeModule,
    OfflineSyncModule,
    HealthModule,
    LoggerModule,
    MetricsModule,
    DatabaseModule,
    AiModule,
    CustomerPortalModule,
    CommunicationModule,
    BullModule,
    ConfigModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [
    AppService,
    {
      provide: MockPrismaService,
      useClass: MockPrismaService,
    },
  ],
})
class AppModule {}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Travel Tech Hub API (Mock Version)')
    .setDescription('API documentation for testing with mock data')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Mock API is running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
});