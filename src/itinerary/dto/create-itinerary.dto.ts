import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityDto } from './activity.dto';

export class CreateItineraryDto {
  @ApiProperty({
    description: 'Itinerary title',
    example: 'Weekend Getaway',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Start date of the itinerary',
    example: '2024-03-20T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the itinerary',
    example: '2024-03-22T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'ID of the lead this itinerary belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  leadId: string;

  @ApiProperty({
    description: 'ID of the user this itinerary belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'List of activities',
    type: [ActivityDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  activities: ActivityDto[];

  @ApiProperty({
    description: 'Preferences for the itinerary',
    example: ['Adventure', 'Cultural'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
} 