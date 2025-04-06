import { Injectable } from '@nestjs/common';
import { MockPrismaService } from '../auth/auth.service';
import { PdfTheme } from '@prisma/client';

@Injectable()
export class PdfThemeService {
  constructor(private prisma: MockPrismaService) {}

  async create(data: Omit<PdfTheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<PdfTheme> {
    return this.prisma.pdfTheme.create({ data });
  }

  async findAll(): Promise<PdfTheme[]> {
    return this.prisma.pdfTheme.findMany();
  }

  async findOne(id: string): Promise<PdfTheme | null> {
    return this.prisma.pdfTheme.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<PdfTheme>): Promise<PdfTheme> {
    return this.prisma.pdfTheme.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<PdfTheme> {
    return this.prisma.pdfTheme.delete({ where: { id } });
  }
}