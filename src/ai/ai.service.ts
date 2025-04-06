import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAI } from 'openai';
import { SimpleItinerary } from './interfaces/simple-itinerary.interface';
import { AiCacheService } from './ai-cache.service';
import { AiErrorTrackerService } from './ai-error-tracker.service';
import { AiErrorTrackerFactory } from './ai-error-tracker.factory';

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

// Cache TTLs for different endpoints (in milliseconds)
const CACHE_TTLS = {
  generateLeadSummary: 86400000, // 24 hours
  optimizeItineraryRoute: 86400000, // 24 hours
  generateAnalyticsInsights: 3600000, // 1 hour
};

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private openai: OpenAI;
  private readonly aiErrorTracker: AiErrorTrackerService;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private cache: AiCacheService,
    private readonly aiErrorTrackerFactory: AiErrorTrackerFactory,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.aiErrorTracker = this.aiErrorTrackerFactory.create();
    
    if (!this.apiKey) {
      console.warn('OPENAI_API_KEY is not set. AI features will not function properly.');
    }

    // Initialize the OpenAI client
    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async generateLeadSummary(lead: SimpleLead): Promise<string> {
    try {
      // Generate cache key
      const cacheKey = this.cache.generateKey('generateLeadSummary', lead);
      
      // Try to get from cache or generate new response
      return await this.cache.getOrSet(
        cacheKey,
        async () => {
          const prompt = this.generateLeadSummaryPrompt(lead);
          const response = await this.callOpenAI('generateLeadSummary', 'gpt-3.5-turbo', prompt);
          return response;
        },
        CACHE_TTLS.generateLeadSummary
      );
    } catch (error) {
      await this.aiErrorTracker.trackError(error, 'generateLeadSummary', 'gpt-3.5-turbo', lead.firstName);
      console.error('Error generating lead summary:', error);
      return 'Failed to generate summary. Please try again later.';
    }
  }

  async generateItineraryOptimization(itinerary: SimpleItinerary): Promise<string> {
    try {
      // Generate cache key
      const cacheKey = this.cache.generateKey('generateItineraryOptimization', itinerary);
      
      // Try to get from cache or generate new response
      return await this.cache.getOrSet(
        cacheKey,
        async () => {
          const prompt = this.generateItineraryOptimizationPrompt(itinerary);
          const response = await this.callOpenAI('generateItineraryOptimization', 'gpt-3.5-turbo', prompt);
          return response;
        },
        CACHE_TTLS.generateLeadSummary
      );
    } catch (error) {
      await this.aiErrorTracker.trackError(error, 'generateItineraryOptimization', 'gpt-3.5-turbo', itinerary.name);
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
      // Generate cache key based on lead stats, not entire leads to make cache more effective
      const leadStats = {
        count: leads.length,
        statusCounts: this.countLeadsByStatus(leads),
        lastUpdated: new Date().toISOString().split('T')[0] // Use date only for daily cache refresh
      };
      
      const cacheKey = this.cache.generateKey('generateAnalyticsInsights', leadStats);
      
      // Try to get from cache or generate new response
      return await this.cache.getOrSet(
        cacheKey,
        async () => {
          const prompt = this.generateAnalyticsPrompt(leads);
          const response = await this.callOpenAI('generateAnalyticsInsights', 'gpt-3.5-turbo', prompt);
          return response;
        },
        CACHE_TTLS.generateAnalyticsInsights
      );
    } catch (error) {
      await this.aiErrorTracker.trackError(error, 'generateAnalyticsInsights', 'gpt-3.5-turbo');
      console.error('Error generating analytics insights:', error);
      return 'Failed to generate insights. Please try again later.';
    }
  }

  async optimizeItineraryRoute(itinerary: any): Promise<any> {
    try {
      const activities = itinerary.activities || [];
      if (activities.length <= 1) {
        return activities;
      }
      
      // Generate cache key
      const cacheKey = this.cache.generateKey('optimizeItineraryRoute', activities);
      
      // Try to get from cache or generate new response
      return await this.cache.getOrSet(
        cacheKey,
        async () => {
          console.log('Making actual API call to OpenAI Chat...');
          
          try {
            // Use gpt-3.5-turbo which is current and widely available
            const response = await this.openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'You are a travel route optimization expert. Return the activities in optimized order as a valid JSON array.',
                },
                {
                  role: 'user',
                  content: `Optimize this travel itinerary route to minimize travel time between locations:
                  ${JSON.stringify(activities, null, 2)}`,
                },
              ],
              temperature: 0.7,
              max_tokens: 500
            });
    
            console.log('Successful chat API call!');
            console.log('Raw response:', response.choices[0].message.content);
            
            try {
              const optimizedRoute = JSON.parse(response.choices[0].message.content || '[]');
              return optimizedRoute;
            } catch (parseError) {
              await this.aiErrorTracker.trackError(parseError, 'optimizeItineraryRoute-parsing', 'gpt-3.5-turbo');
              console.error('Error parsing response:', parseError);
              console.log('Raw response content:', response.choices[0].message.content);
              // Return the original activities if we can't parse the response
              return activities;
            }
          } catch (apiError) {
            // Log the real API error
            await this.aiErrorTracker.trackError(apiError, 'optimizeItineraryRoute', 'gpt-3.5-turbo');
            console.error('OpenAI API error in optimizeItineraryRoute:', apiError);
            return activities;
          }
        },
        CACHE_TTLS.optimizeItineraryRoute
      );
    } catch (error) {
      console.error('Error optimizing itinerary route:', error);
      return itinerary.activities;
    }
  }

  private async callOpenAI(endpoint: string, modelName: string, prompt: string): Promise<string> {
    try {
      // Try to use the OpenAI API with a current model
      try {
        console.log('Making actual API call to OpenAI with prompt:', prompt.substring(0, 100) + '...');
        
        // Use gpt-3.5-turbo through the chat completions API
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful travel agency assistant.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.7,
        });
        
        console.log('Successful API call to OpenAI!');
        return response.choices[0].message.content || '';
      } catch (apiError) {
        // Log the real API error
        await this.aiErrorTracker.trackError(apiError, endpoint, modelName, prompt.substring(0, 100));
        console.error('OpenAI API error:', apiError);
        
        // Return the error message so we can see it
        return `API Error: ${apiError.message || 'Unknown error'}`;
      }
    } catch (error) {
      console.error('Error in callOpenAI:', error);
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
      
      Name: ${itinerary.name}
      Start Date: ${itinerary.startDate}
      End Date: ${itinerary.endDate}
      Status: ${itinerary.status}
      
      Please provide:
      1. Suggestions to enhance the itinerary
      2. Potential efficiency improvements
      3. Additional experiences that could be added
      4. Any cost-saving opportunities
    `;
  }

  private generateAnalyticsPrompt(leads: SimpleLead[]): string {
    const statusCounts = this.countLeadsByStatus(leads);
    
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
  
  private countLeadsByStatus(leads: SimpleLead[]): Record<string, number> {
    const leadStatuses = leads.map(lead => lead.status);
    const statusCounts: Record<string, number> = {};
    
    leadStatuses.forEach(status => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return statusCounts;
  }
} 