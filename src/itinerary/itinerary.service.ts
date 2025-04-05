import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class ItineraryService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('itinerary') private itineraryQueue: Queue,
    private aiService: AiService,
    private pdfService: PdfService,
  ) {}

  async create(createItineraryDto: CreateItineraryDto) {
    const { activities, ...itineraryData } = createItineraryDto;

    const itinerary = await this.prisma.itinerary.create({
      data: {
        ...itineraryData,
        activities: {
          create: activities,
        },
      },
      include: {
        activities: true,
        lead: true,
      },
    });

    // Queue AI analysis for optimization
    await this.itineraryQueue.add('optimize', {
      itineraryId: itinerary.id,
      data: createItineraryDto,
    });

    return itinerary;
  }

  async findAll() {
    return this.prisma.itinerary.findMany({
      include: {
        activities: true,
        lead: true,
      },
    });
  }

  async findOne(id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        activities: true,
        lead: true,
      },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }

    return itinerary;
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    const { activities, ...itineraryData } = updateItineraryDto;

    const itinerary = await this.prisma.itinerary.update({
      where: { id },
      data: {
        ...itineraryData,
        activities: activities
          ? {
              deleteMany: {},
              create: activities,
            }
          : undefined,
      },
      include: {
        activities: true,
        lead: true,
      },
    });

    // Queue AI analysis if significant changes
    if (this.isSignificantChange(updateItineraryDto)) {
      await this.itineraryQueue.add('optimize', {
        itineraryId: itinerary.id,
        data: updateItineraryDto,
      });
    }

    return itinerary;
  }

  async remove(id: string) {
    return this.prisma.itinerary.delete({
      where: { id },
    });
  }

  async generatePdf(id: string, theme?: string) {
    const itinerary = await this.findOne(id);
    return this.pdfService.generateItineraryPdf(itinerary, theme);
  }

  async optimizeRoute(id: string) {
    const itinerary = await this.findOne(id);
    const optimizedActivities = await this.aiService.optimizeItineraryRoute(itinerary);
    
    return this.prisma.itinerary.update({
      where: { id },
      data: {
        activities: {
          deleteMany: {},
          create: optimizedActivities,
        },
      },
      include: {
        activities: true,
        lead: true,
      },
    });
  }

  async calculateCost(id: string) {
    const itinerary = await this.findOne(id);
    return this.aiService.calculateItineraryCost(itinerary);
  }

  private isSignificantChange(updateItineraryDto: UpdateItineraryDto): boolean {
    return (
      updateItineraryDto.activities !== undefined ||
      updateItineraryDto.startDate !== undefined ||
      updateItineraryDto.endDate !== undefined
    );
  }
} 