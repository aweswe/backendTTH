import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AiService, SimpleLead } from '../ai/ai.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('analytics') private analyticsQueue: Queue,
    private aiService: AiService,
  ) {}

  async getOverviewStats() {
    try {
      // Get counts from database
      const totalLeads = await this.prisma.lead.count();
      const activeLeads = await this.prisma.lead.count({
        where: { status: 'NEW' },
      });
      const totalItineraries = await this.prisma.itinerary.count();
      const completedItineraries = await this.prisma.itinerary.count({
        where: { status: 'COMPLETED' },
      });
      
      // Calculate metrics
      const conversionRate = totalLeads > 0 ? (completedItineraries / totalLeads) * 100 : 0;
      const revenue = await this.calculateTotalRevenue();
      
      return {
        totalLeads,
        activeLeads,
        totalItineraries,
        completedItineraries,
        conversionRate: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
        revenue,
      };
    } catch (error) {
      console.error('Error getting overview stats:', error);
      throw new Error('Failed to get overview statistics');
    }
  }

  async getSalesTimeline(startDate: Date, endDate: Date) {
    try {
      // Get leads and itineraries within date range
      const leads = await this.prisma.lead.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      
      const itineraries = await this.prisma.itinerary.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      
      // Group by date
      const timelineData = this.groupByDate(leads, itineraries, startDate, endDate);
      
      return timelineData;
    } catch (error) {
      console.error('Error getting sales timeline:', error);
      throw new Error('Failed to get sales timeline');
    }
  }

  async getTeamPerformance(startDate: Date, endDate: Date) {
    try {
      // Get all users with their leads
      const users = await this.prisma.user.findMany({
        include: {
          leads: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          itineraries: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });
      
      // Format the team performance data
      return users.map((user: any) => ({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        totalLeads: user.leads.length,
        activeLeads: user.leads.filter((lead: any) => lead.status === 'NEW').length,
        conversionRate: user.leads.length > 0 
          ? (user.leads.filter((lead: any) => lead.status === 'WON').length / user.leads.length) * 100 
          : 0,
      }));
    } catch (error) {
      console.error('Error getting team performance:', error);
      throw new Error('Failed to get team performance');
    }
  }

  async getLeadSources() {
    try {
      // Get all leads with their source
      const leads = await this.prisma.lead.findMany({
        select: {
          source: true,
        },
      });
      
      // Count leads by source
      const sourceCounts: Record<string, number> = {};
      leads.forEach((lead: any) => {
        const source = lead.source || 'Unknown';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });
      
      // Format the result
      return Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
        percentage: (count / leads.length) * 100,
      }));
    } catch (error) {
      console.error('Error getting lead sources:', error);
      throw new Error('Failed to get lead sources');
    }
  }

  async getAiInsights() {
    try {
      // Get leads for AI analysis
      const leadsWithNotes = await this.prisma.lead.findMany({
        include: {
          notes: true,
        },
      });
      
      // Transform to match AI service expectations
      const simpleLeads: SimpleLead[] = leadsWithNotes.map((lead: any) => ({
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        status: lead.status,
        notes: lead.notes.map((note: any) => ({ content: note.content })),
        lastContacted: lead.lastContacted,
      }));
      
      // Use AI service to generate insights
      const insights = await this.aiService.generateAnalyticsInsights(simpleLeads);
      
      return { insights };
    } catch (error) {
      console.error('Error getting AI insights:', error);
      throw new Error('Failed to get AI insights');
    }
  }

  private async calculateTotalRevenue(): Promise<number> {
    try {
      // Get all completed itineraries
      const itineraries = await this.prisma.itinerary.findMany({
        where: { status: 'COMPLETED' },
      });
      
      // Sum up the costs (using a hardcoded value for now)
      return itineraries.length * 1000; // Simple placeholder calculation
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  }

  private groupByDate(leads: any[], itineraries: any[], startDate: Date, endDate: Date) {
    // Create date range
    const dateRange: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create timeline data
    return dateRange.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      
      // Count leads and itineraries for this date
      const leadsForDate = leads.filter(lead => 
        lead.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      
      const itinerariesForDate = itineraries.filter(itinerary => 
        itinerary.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      
      return {
        date: dateStr,
        leads: leadsForDate,
        itineraries: itinerariesForDate,
      };
    });
  }
} 