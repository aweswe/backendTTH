import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadDto {
  @ApiProperty({
    description: 'Lead first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Lead last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Lead email',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Lead phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'Lead source',
    example: 'Website',
    required: false,
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({
    description: 'Lead status',
    example: LeadStatus.CONTACTED,
    required: false,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({
    description: 'ID of the user assigned to this lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
} 