import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ActivityDto {
  @ApiProperty({
    description: 'Activity name',
    example: 'City Tour',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Activity description',
    example: 'Guided tour of the city center',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Activity start time',
    example: '2024-03-20T09:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'Activity end time',
    example: '2024-03-20T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    description: 'Activity location',
    example: 'City Center',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Activity cost',
    example: 50.00,
    required: false,
  })
  @IsOptional()
  @IsString()
  cost?: string;
}

export class CreateItineraryDto {
  @ApiProperty({
    description: 'Itinerary title',
    example: 'Weekend Getaway',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Itinerary description',
    example: 'A perfect weekend escape',
  })
  @IsString()
  description: string;

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
  @IsUUID()
  leadId: string;

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