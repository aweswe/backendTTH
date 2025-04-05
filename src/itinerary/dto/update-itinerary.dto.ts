import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateActivityDto {
  @ApiProperty({
    description: 'Activity name',
    example: 'City Tour',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Activity description',
    example: 'Guided tour of the city center',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Activity start time',
    example: '2024-03-20T09:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime?: Date;

  @ApiProperty({
    description: 'Activity end time',
    example: '2024-03-20T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @ApiProperty({
    description: 'Activity location',
    example: 'City Center',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Activity cost',
    example: 50.00,
    required: false,
  })
  @IsOptional()
  @IsString()
  cost?: string;
}

export class UpdateItineraryDto {
  @ApiProperty({
    description: 'Itinerary title',
    example: 'Weekend Getaway',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Itinerary description',
    example: 'A perfect weekend escape',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Start date of the itinerary',
    example: '2024-03-20T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'End date of the itinerary',
    example: '2024-03-22T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'List of activities',
    type: [UpdateActivityDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateActivityDto)
  activities?: UpdateActivityDto[];

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