import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MockPrismaService } from '../auth/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, MockPrismaService],
  exports: [UsersService],
})
export class UsersModule {}