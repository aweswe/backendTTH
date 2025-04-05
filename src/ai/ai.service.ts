import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

export interface SimpleNote {
  content: string;
}

export interface SimpleLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  status: string;
  notes?: SimpleNote[];
  lastContacted?: Date;
}

export interface SimpleItinerary {
  id: string;
  title: string;
  description?: string;
  status: string;
}

@Injectable()
export class AiService {
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('OPENAI_API_KEY is not set. AI features will not function properly.');
      this.apiKey = '';
    } else {
      this.apiKey = apiKey;
    }
  }

  async generateLeadSummary(lead: SimpleLead): Promise<string> {
    try {
      const prompt = this.generateLeadSummaryPrompt(lead);
      const response = await this.callOpenAI(prompt);
      return response;
    } catch (error) {
      console.error('Error generating lead summary:', error);
      return 'Failed to generate summary. Please try again later.';
    }
  }

  async generateItineraryOptimization(itinerary: SimpleItinerary): Promise<string> {
    try {
      const prompt = this.generateItineraryOptimizationPrompt(itinerary);
      const response = await this.callOpenAI(prompt);
      return response;
    } catch (error) {
      console.error('Error generating itinerary optimization:', error);
      return 'Failed to optimize itinerary. Please try again later.';
    }
  }

  async calculateItineraryCost(itinerary: SimpleItinerary): Promise<number> {
    try {
      // In a real implementation, this would use more sophisticated pricing logic
      // For now, we'll just generate a random number between 1000 and 5000
      return Math.floor(Math.random() * 4000) + 1000;
    } catch (error) {
      console.error('Error calculating itinerary cost:', error);
      return 0;
    }
  }

  async generateAnalyticsInsights(leads: SimpleLead[]): Promise<string> {
    try {
      const prompt = this.generateAnalyticsPrompt(leads);
      const response = await this.callOpenAI(prompt);
      return response;
    } catch (error) {
      console.error('Error generating analytics insights:', error);
      return 'Failed to generate insights. Please try again later.';
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'gpt-3.5-turbo-instruct',
          prompt,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error('Failed to get response from AI service');
    }
  }

  private generateLeadSummaryPrompt(lead: SimpleLead): string {
    return `
      Provide a concise summary of this lead for a travel agency:
      
      Name: ${lead.firstName} ${lead.lastName}
      Email: ${lead.email}
      Company: ${lead.company || 'Not specified'}
      Status: ${lead.status}
      Last Contacted: ${lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : 'Never'}
      Notes: ${lead.notes?.map((note: SimpleNote) => note.content).join(', ') || 'No notes'}
      
      Please include:
      1. A brief overview of the lead
      2. Key points from their notes
      3. Suggested next steps based on their status
      4. Any red flags or opportunities
    `;
  }

  private generateItineraryOptimizationPrompt(itinerary: SimpleItinerary): string {
    return `
      Suggest optimizations for this travel itinerary:
      
      Title: ${itinerary.title}
      Description: ${itinerary.description || 'No description'}
      Status: ${itinerary.status}
      
      Please provide:
      1. Suggestions to enhance the itinerary
      2. Potential efficiency improvements
      3. Additional experiences that could be added
      4. Any cost-saving opportunities
    `;
  }

  private generateAnalyticsPrompt(leads: SimpleLead[]): string {
    const leadStatuses = leads.map(lead => lead.status);
    const statusCounts: Record<string, number> = {};
    
    leadStatuses.forEach(status => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const statusSummary = Object.entries(statusCounts)
      .map(([status, count]) => `${status}: ${count}`)
      .join(', ');
    
    return `
      Analyze the following lead data for a travel agency and provide business insights:
      
      Total Leads: ${leads.length}
      Lead Status Distribution: ${statusSummary}
      
      Please provide:
      1. Insights about lead quality and conversion potential
      2. Patterns or trends in the data
      3. Recommendations for lead management
      4. Suggestions for improving conversion rates
    `;
  }
} 