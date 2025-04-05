import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class CustomerPortalService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('customer-portal') private customerQueue: Queue,
    private pdfService: PdfService,
  ) {}

  async getCustomerItinerary(customerId: string, itineraryId: string) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        lead: {
          id: customerId,
        },
      },
      include: {
        activities: true,
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return itinerary;
  }

  async submitFeedback(
    customerId: string,
    itineraryId: string,
    feedback: string,
    rating: number,
  ) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        lead: {
          id: customerId,
        },
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return this.prisma.feedback.create({
      data: {
        content: feedback,
        rating,
        itineraryId,
        customerId,
      },
    });
  }

  async uploadDocuments(
    customerId: string,
    itineraryId: string,
    files: Express.Multer.File[],
  ) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        lead: {
          id: customerId,
        },
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    // Queue file processing
    await this.customerQueue.add('process-documents', {
      customerId,
      itineraryId,
      files,
    });

    return { message: 'Documents uploaded successfully' };
  }

  async approveItinerary(customerId: string, itineraryId: string) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        lead: {
          id: customerId,
        },
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return this.prisma.itinerary.update({
      where: { id: itineraryId },
      data: { status: 'APPROVED' },
    });
  }

  async getItineraryPdf(customerId: string, itineraryId: string, theme?: string) {
    const itinerary = await this.prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        lead: {
          id: customerId,
        },
      },
      include: {
        activities: true,
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return this.pdfService.generateItineraryPdf(itinerary, theme);
  }

  async getCustomerNotifications(customerId: string) {
    return this.prisma.notification.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markNotificationAsRead(customerId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        customerId,
      },
      data: {
        read: true,
      },
    });
  }
} 