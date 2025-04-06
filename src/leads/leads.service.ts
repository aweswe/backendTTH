import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AiService } from '../ai/ai.service';
import { SimpleLead } from '../ai/ai.service';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        status: 'NEW',
        assignedUser: {
          connect: { id: createLeadDto.assignedToId },
        },
        firstName: createLeadDto.firstName,
        lastName: createLeadDto.lastName,
        email: createLeadDto.email,
        phone: createLeadDto.phone,
        source: createLeadDto.source,
        userId: createLeadDto.userId,
      },
      include: {
        assignedUser: true,
      },
    });

    // Generate AI summary
    const summary = await this.aiService.generateLeadSummary({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      company: lead.company || undefined,
      status: lead.status,
      notes: [],
    });

    await this.prisma.lead.update({
      where: { id: lead.id },
      data: { aiSummary: summary },
    });

    return lead;
  }

  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        assignedUser: true,
        notes: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignedUser: true,
        notes: true,
      },
    });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    return this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        assignedUser: true,
        notes: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.lead.delete({
      where: { id },
    });
  }

  async addNote(leadId: string, content: string, userId: string) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        notes: {
          create: {
            content,
            userId
          }
        }
      },
      include: { notes: true }
    });
  }

  async getNotes(leadId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        notes: {
          include: {
            user: true
          }
        }
      }
    });
    return lead?.notes || [];
  }

  async generateAiSummary(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        notes: true,
        assignedUser: true
      }
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    const simpleLead: SimpleLead = {
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      company: lead.company || undefined,
      status: lead.status,
      notes: lead.notes.map(note => ({ content: note.content })),
    };

    return this.aiService.generateLeadSummary(simpleLead);
  }
} 