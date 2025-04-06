import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as dotenv from 'dotenv';
import { AiCacheService } from './ai-cache.service';
import { AiErrorTrackerService } from './ai-error-tracker.service';
import { AiErrorTrackerFactory } from './ai-error-tracker.factory';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

describe('AiService', () => {
  let service: AiService;
  let configService: ConfigService;
  let mockCache: jest.Mocked<AiCacheService>;
  let mockErrorTracker: jest.Mocked<AiErrorTrackerService>;
  let mockErrorTrackerFactory: jest.Mocked<AiErrorTrackerFactory>;

  beforeEach(async () => {
    mockCache = {
      generateKey: jest.fn(),
      getOrSet: jest.fn(),
    } as any;

    mockErrorTracker = {
      trackError: jest.fn(),
    } as any;

    const mockErrorTrackerFactory = {
      create: jest.fn().mockReturnValue(mockErrorTracker),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            lead: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: AiCacheService,
          useValue: mockCache,
        },
        {
          provide: AiErrorTrackerFactory,
          useValue: mockErrorTrackerFactory,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get<ConfigService>(ConfigService);
    mockCache.generateKey.mockReturnValue('test-cache-key');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateLeadSummary', () => {
    it('should generate a lead summary', async () => {
      const mockLead = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        status: 'NEW',
        notes: [{ content: 'Test note' }]
      };

      // Mock successful cache operation
      mockCache.getOrSet.mockResolvedValueOnce('Generated summary for John Doe');

      const result = await service.generateLeadSummary(mockLead);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockCache.generateKey).toHaveBeenCalledWith('generateLeadSummary', mockLead);
      expect(mockCache.getOrSet).toHaveBeenCalled();
      console.log('Generated lead summary:', result);
    }, 10000);

    it('should handle errors gracefully', async () => {
      const mockLead = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        status: 'CONTACTED',
      };

      // Mock cache error
      mockCache.getOrSet.mockRejectedValueOnce(new Error('Cache error'));

      const result = await service.generateLeadSummary(mockLead);
      expect(result).toBeDefined();
      expect(result).toBe('Failed to generate summary. Please try again later.');
      expect(mockErrorTracker.trackError).toHaveBeenCalled();
    });
  });

  describe('optimizeItineraryRoute', () => {
    it('should optimize an itinerary route', async () => {
      const mockItinerary = {
        id: '1',
        name: 'Test Itinerary',
        activities: [
          { name: 'Activity 1', location: 'New York', startTime: new Date(), endTime: new Date() },
          { name: 'Activity 2', location: 'Los Angeles', startTime: new Date(), endTime: new Date() },
        ],
      };

      mockCache.getOrSet.mockResolvedValueOnce(mockItinerary.activities);

      const result = await service.optimizeItineraryRoute(mockItinerary);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockItinerary.activities);
    });
  });

  describe('generateAnalyticsInsights', () => {
    it('should generate analytics insights', async () => {
      const mockLeads = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'NEW' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', status: 'QUALIFIED' },
      ];

      mockCache.getOrSet.mockResolvedValueOnce('Generated insights');

      const result = await service.generateAnalyticsInsights(mockLeads);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toBe('Generated insights');
    });
  });
});