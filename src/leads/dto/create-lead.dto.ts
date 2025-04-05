import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Lead first name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Lead last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Lead email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

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
    description: 'ID of the user assigned to this lead',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  assignedToId: string;
} 