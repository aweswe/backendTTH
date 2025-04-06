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

    // Create a note instead of feedback since the feedback model might not be available yet
    return this.prisma.$transaction(async (tx) => {
      // Create a note with the feedback
      const note = await tx.note.create({
        data: {
          content: `Feedback: ${feedback} (Rating: ${rating}/5)`,
          leadId: customerId,
          userId: itinerary.userId, // Assign to the itinerary creator
        },
      });
      
      return {
        id: note.id,
        content: feedback,
        rating,
        itineraryId,
        customerId,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      };
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

    // Pass just the ID strings to the PDF service
    return this.pdfService.generateItineraryPdf(itineraryId, theme);
  }

  async getCustomerNotifications(customerId: string) {
    return this.prisma.notification.findMany({
      where: {
        // Use userId instead of customerId
        userId: customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async getItinerary(itineraryId: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: itineraryId },
      include: {
        activities: true,
        lead: true,
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    return itinerary;
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { 
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateItineraryDocument(itineraryId: string, themeId: string) {
    const [itinerary, theme] = await Promise.all([
      this.getItinerary(itineraryId),
      this.prisma.pdfTheme.findUnique({
        where: { id: themeId },
      }),
    ]);

    if (!itinerary || !theme) {
      throw new NotFoundException('Itinerary or theme not found');
    }

    // Use the correct method name from PdfService
    return this.pdfService.generateItineraryPdf(itineraryId, themeId);
  }
} 