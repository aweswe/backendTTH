import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export class ParseDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): Date {
    if (!value) {
      throw new BadRequestException('Date parameter is required');
    }
    
    const parsedDate = new Date(value);
    
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    
    return parsedDate;
  }
} 