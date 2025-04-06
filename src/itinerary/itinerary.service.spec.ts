import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryService } from './itinerary.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { PdfService } from '../pdf/pdf.service';

describe('ItineraryService', () => {
  let service: ItineraryService;
  let prisma: PrismaService;
  let aiService: AiService;
  let pdfService: PdfService;

  const mockPrismaService = {
    itinerary: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAiService = {
    optimizeItineraryRoute: jest.fn(),
  };

  const mockPdfService = {
    generateItineraryPdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItineraryService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AiService, useValue: mockAiService },
        { provide: PdfService, useValue: mockPdfService },
      ],
    }).compile();

    service = module.get<ItineraryService>(ItineraryService);
    prisma = module.get<PrismaService>(PrismaService);
    aiService = module.get<AiService>(AiService);
    pdfService = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an itinerary with activities', async () => {
      const createItineraryDto = {
        name: 'Test Itinerary',
        startDate: new Date(),
        endDate: new Date(),
        leadId: 'lead-1',
        userId: 'user-1',
        activities: [
          {
            name: 'Activity 1',
            description: 'Test activity',
            location: 'Test location',
            startTime: new Date(),
            endTime: new Date(),
          },
        ],
      };

      const mockItinerary = {
        id: 'itinerary-1',
        ...createItineraryDto,
      };

      mockPrismaService.itinerary.create.mockResolvedValue(mockItinerary);

      const result = await service.create(createItineraryDto);

      expect(result).toEqual(mockItinerary);
      expect(mockPrismaService.itinerary.create).toHaveBeenCalledWith({
        data: {
          ...createItineraryDto,
          activities: {
            create: createItineraryDto.activities,
          },
        },
        include: {
          activities: true,
          lead: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all itineraries', async () => {
      const mockItineraries = [
        {
          id: 'itinerary-1',
          name: 'Test Itinerary',
        },
      ];

      mockPrismaService.itinerary.findMany.mockResolvedValue(mockItineraries);

      const result = await service.findAll();

      expect(result).toEqual(mockItineraries);
      expect(mockPrismaService.itinerary.findMany).toHaveBeenCalledWith({
        include: {
          activities: true,
          lead: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return an itinerary by id', async () => {
      const mockItinerary = {
        id: 'itinerary-1',
        name: 'Test Itinerary',
      };

      mockPrismaService.itinerary.findUnique.mockResolvedValue(mockItinerary);

      const result = await service.findOne('itinerary-1');

      expect(result).toEqual(mockItinerary);
      expect(mockPrismaService.itinerary.findUnique).toHaveBeenCalledWith({
        where: { id: 'itinerary-1' },
        include: {
          activities: true,
          lead: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an itinerary', async () => {
      const updateItineraryDto = {
        name: 'Updated Itinerary',
        activities: [
          {
            name: 'Updated Activity',
            description: 'Updated description',
            location: 'Updated location',
            startTime: new Date(),
            endTime: new Date(),
          },
        ],
      };

      const mockUpdatedItinerary = {
        id: 'itinerary-1',
        ...updateItineraryDto,
      };

      mockPrismaService.itinerary.update.mockResolvedValue(mockUpdatedItinerary);

      const result = await service.update('itinerary-1', updateItineraryDto);

      expect(result).toEqual(mockUpdatedItinerary);
      expect(mockPrismaService.itinerary.update).toHaveBeenCalledWith({
        where: { id: 'itinerary-1' },
        data: {
          ...updateItineraryDto,
          activities: {
            deleteMany: {},
            create: updateItineraryDto.activities,
          },
        },
        include: {
          activities: true,
          lead: true,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete an itinerary', async () => {
      mockPrismaService.itinerary.delete.mockResolvedValue({ id: 'itinerary-1' });

      await service.remove('itinerary-1');

      expect(mockPrismaService.itinerary.delete).toHaveBeenCalledWith({
        where: { id: 'itinerary-1' },
      });
    });
  });

  describe('optimizeRoute', () => {
    it('should optimize itinerary route', async () => {
      const mockItinerary = {
        id: 'itinerary-1',
        name: 'Test Itinerary',
        activities: [
          {
            name: 'Activity 1',
            description: 'Test activity',
            location: 'Test location',
            startTime: new Date(),
            endTime: new Date(),
          },
        ],
      };

      const mockOptimizedActivities = [
        {
          name: 'Optimized Activity',
          description: 'Optimized description',
          location: 'Optimized location',
          startTime: new Date(),
          endTime: new Date(),
        },
      ];

      mockPrismaService.itinerary.findUnique.mockResolvedValue(mockItinerary);
      mockAiService.optimizeItineraryRoute.mockResolvedValue(mockOptimizedActivities);
      mockPrismaService.itinerary.update.mockResolvedValue({
        ...mockItinerary,
        activities: mockOptimizedActivities,
      });

      const result = await service.optimizeRoute('itinerary-1');

      expect(result).toEqual({
        ...mockItinerary,
        activities: mockOptimizedActivities,
      });
      expect(mockAiService.optimizeItineraryRoute).toHaveBeenCalledWith(expect.objectContaining({
        id: 'itinerary-1',
        name: 'Test Itinerary'
      }));
    });

    it('should throw error if itinerary not found', async () => {
      mockPrismaService.itinerary.findUnique.mockResolvedValue(null);

      await expect(service.optimizeRoute('itinerary-1')).rejects.toThrow('Itinerary not found');
    });
  });
}); 