import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AiService } from '../ai/ai.service';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('leads') private leadsQueue: Queue,
    private aiService: AiService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        ...createLeadDto,
        status: LeadStatus.NEW,
      },
      include: {
        assignedTo: true,
        notes: true,
        quotes: true,
      },
    });

    // Queue AI analysis
    await this.leadsQueue.add('analyze', {
      leadId: lead.id,
      data: createLeadDto,
    });

    return lead;
  }

  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        assignedTo: true,
        notes: true,
        quotes: true,
      },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        notes: true,
        quotes: true,
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const lead = await this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        assignedTo: true,
        notes: true,
        quotes: true,
      },
    });

    // Queue AI analysis if significant changes
    if (this.isSignificantChange(updateLeadDto)) {
      await this.leadsQueue.add('analyze', {
        leadId: lead.id,
        data: updateLeadDto,
      });
    }

    return lead;
  }

  async remove(id: string) {
    return this.prisma.lead.delete({
      where: { id },
    });
  }

  async addNote(leadId: string, content: string, userId: string) {
    return this.prisma.note.create({
      data: {
        content,
        leadId,
        userId,
      },
    });
  }

  async generateAiSummary(leadId: string) {
    const lead = await this.findOne(leadId);
    const summary = await this.aiService.generateLeadSummary(lead);
    
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { aiSummary: summary },
    });
  }

  private isSignificantChange(updateLeadDto: UpdateLeadDto): boolean {
    return (
      updateLeadDto.status !== undefined ||
      updateLeadDto.assignedToId !== undefined ||
      updateLeadDto.email !== undefined
    );
  }
} 