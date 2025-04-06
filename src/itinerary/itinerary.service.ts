import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';
import { ActivityDto } from './dto/activity.dto';

@Injectable()
export class ItineraryService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private pdfService: PdfService,
  ) {}

  async create(createItineraryDto: CreateItineraryDto) {
    const { activities, ...itineraryData } = createItineraryDto;
    
    return this.prisma.itinerary.create({
      data: {
        ...itineraryData,
        activities: {
          create: activities.map((activity: ActivityDto) => ({
            name: activity.name,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
          })),
        },
      },
      include: {
        activities: true,
        lead: true,
      },
    });
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
    return this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        activities: true,
        lead: true,
      },
    });
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    const { activities, ...itineraryData } = updateItineraryDto;
    
    return this.prisma.itinerary.update({
      where: { id },
      data: {
        ...itineraryData,
        activities: activities ? {
          deleteMany: {},
          create: activities.map((activity: ActivityDto) => ({
            name: activity.name,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
          })),
        } : undefined,
      },
      include: {
        activities: true,
        lead: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.itinerary.delete({
      where: { id },
    });
  }

  async generatePdf(id: string, themeId?: string) {
    const itinerary = await this.findOne(id);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    return this.pdfService.generateItineraryPdf(id, themeId);
  }

  async optimizeRoute(id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        activities: true,
        lead: true,
      },
    });

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const optimizedActivities = await this.aiService.optimizeItineraryRoute({
      id: itinerary.id,
      name: itinerary.name,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      leadId: itinerary.leadId,
      userId: itinerary.userId,
      status: itinerary.status,
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt,
    });
    
    return this.prisma.itinerary.update({
      where: { id },
      data: {
        activities: {
          deleteMany: {},
          create: optimizedActivities.map((activity: ActivityDto) => ({
            name: activity.name,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
          })),
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
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    return this.aiService.calculateItineraryCost({
      id: itinerary.id,
      name: itinerary.name,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      leadId: itinerary.leadId,
      userId: itinerary.userId,
      status: itinerary.status,
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt,
    });
  }
} 