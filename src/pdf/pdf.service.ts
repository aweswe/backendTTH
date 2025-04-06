import { Injectable } from '@nestjs/common';
import { MockPrismaService } from '../auth/auth.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  constructor(private prisma: MockPrismaService) {}

  async generateItineraryPdf(itineraryId: string, themeId?: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: itineraryId },
      include: {
        activities: true,
        lead: true,
      },
    });

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const theme = themeId
      ? await this.prisma.pdfTheme.findUnique({ where: { id: themeId } })
      : null;

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      font: theme?.fontFamily || 'Helvetica',
    });

    // Set font size separately after creation
    doc.fontSize(theme?.fontSize || 12);

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    return new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add title
      doc
        .fontSize(24)
        .text(itinerary.name, { align: 'center' })
        .moveDown();

      // Add lead information
      if (itinerary.lead) {
        doc
          .fontSize(16)
          .text('Lead Information')
          .moveDown()
          .fontSize(12)
          .text(`Name: ${itinerary.lead.firstName} ${itinerary.lead.lastName}`)
          .text(`Email: ${itinerary.lead.email}`)
          .text(`Phone: ${itinerary.lead.phone || 'N/A'}`)
          .moveDown();
      }

      // Add activities
      doc
        .fontSize(16)
        .text('Activities')
        .moveDown();

      itinerary.activities.forEach((activity: any) => {
        doc
          .fontSize(14)
          .text(activity.name)
          .fontSize(12)
          .text(`Location: ${activity.location || 'N/A'}`)
          .text(`Start: ${activity.startTime.toLocaleString()}`)
          .text(`End: ${activity.endTime.toLocaleString()}`)
          .moveDown();

        if (activity.description) {
          doc
            .fontSize(12)
            .text(activity.description)
            .moveDown();
        }
      });

      doc.end();
    });
  }
}