import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;
} 