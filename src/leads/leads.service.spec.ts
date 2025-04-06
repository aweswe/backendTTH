import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { MockPrismaService } from '../auth/auth.service';
import { AiService } from '../ai/ai.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: MockPrismaService;
  let aiService: AiService;

  const mockPrismaService = {
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    note: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockAiService = {
    generateLeadSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: MockPrismaService, useValue: mockPrismaService },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    prisma = module.get<MockPrismaService>(MockPrismaService);
    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a lead and generate AI summary', async () => {
      const createLeadDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        source: 'website',
        assignedToId: 'user-1',
        userId: 'user-1'
      };

      const mockLead = {
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        source: 'website',
        status: 'NEW',
        userId: 'user-1',
      };

      const mockSummary = 'AI generated summary';

      mockPrismaService.lead.create.mockResolvedValue(mockLead);
      mockPrismaService.lead.update.mockResolvedValue({ ...mockLead, aiSummary: mockSummary });
      mockAiService.generateLeadSummary.mockResolvedValue(mockSummary);

      const result = await service.create(createLeadDto);

      expect(result).toEqual(mockLead);
      expect(mockPrismaService.lead.create).toHaveBeenCalledWith({
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
      expect(mockAiService.generateLeadSummary).toHaveBeenCalledWith(expect.objectContaining({
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      }));
    });
  });

  describe('findAll', () => {
    it('should return all leads', async () => {
      const mockLeads = [
        {
          id: 'lead-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      ];

      mockPrismaService.lead.findMany.mockResolvedValue(mockLeads);

      const result = await service.findAll();

      expect(result).toEqual(mockLeads);
      expect(mockPrismaService.lead.findMany).toHaveBeenCalledWith({
        include: {
          assignedUser: true,
          notes: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a lead by id', async () => {
      const mockLead = {
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      mockPrismaService.lead.findUnique.mockResolvedValue(mockLead);

      const result = await service.findOne('lead-1');

      expect(result).toEqual(mockLead);
      expect(mockPrismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 'lead-1' },
        include: {
          assignedUser: true,
          notes: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a lead', async () => {
      const updateLeadDto = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const mockUpdatedLead = {
        id: 'lead-1',
        ...updateLeadDto,
      };

      mockPrismaService.lead.update.mockResolvedValue(mockUpdatedLead);

      const result = await service.update('lead-1', updateLeadDto);

      expect(result).toEqual(mockUpdatedLead);
      expect(mockPrismaService.lead.update).toHaveBeenCalledWith({
        where: { id: 'lead-1' },
        data: updateLeadDto,
        include: {
          assignedUser: true,
          notes: true,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a lead', async () => {
      mockPrismaService.lead.delete.mockResolvedValue({ id: 'lead-1' });

      await service.remove('lead-1');

      expect(mockPrismaService.lead.delete).toHaveBeenCalledWith({
        where: { id: 'lead-1' },
      });
    });
  });

  describe('addNote', () => {
    it('should add a note to a lead', async () => {
      const mockLead = {
        id: 'lead-1',
        firstName: 'Jane',
        lastName: 'Doe',
        notes: [
          {
            id: 'note-1',
            content: 'Test note',
            leadId: 'lead-1',
            userId: 'user-1',
          }
        ]
      };

      mockPrismaService.lead.update.mockResolvedValue(mockLead);

      const result = await service.addNote('lead-1', 'Test note', 'user-1');

      expect(result).toEqual(mockLead);
      expect(mockPrismaService.lead.update).toHaveBeenCalledWith({
        where: { id: 'lead-1' },
        data: {
          notes: {
            create: {
              content: 'Test note',
              userId: 'user-1'
            }
          }
        },
        include: { notes: true }
      });
    });
  });

  describe('getNotes', () => {
    it('should get all notes for a lead', async () => {
      const mockNotes = [
        {
          id: 'note-1',
          content: 'Test note',
          leadId: 'lead-1',
        },
      ];

      const mockLead = {
        id: 'lead-1',
        firstName: 'Jane',
        lastName: 'Doe',
        notes: mockNotes
      };

      mockPrismaService.lead.findUnique.mockResolvedValue(mockLead);

      const result = await service.getNotes('lead-1');

      expect(result).toEqual(mockNotes);
      expect(mockPrismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 'lead-1' },
        include: {
          notes: {
            include: {
              user: true
            }
          }
        }
      });
    });
  });

  describe('generateAiSummary', () => {
    it('should generate AI summary for a lead', async () => {
      const mockLead = {
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Doe',
        status: 'NEW',
        notes: [{ content: 'Test note' }]
      };

      const mockSummary = 'AI generated summary';

      mockPrismaService.lead.findUnique.mockResolvedValue(mockLead);
      mockPrismaService.lead.update.mockResolvedValue({ ...mockLead, aiSummary: mockSummary });
      mockAiService.generateLeadSummary.mockResolvedValue(mockSummary);

      const result = await service.generateAiSummary('lead-1');

      expect(result).toEqual(mockSummary);
      expect(mockAiService.generateLeadSummary).toHaveBeenCalledWith({
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Doe',
        status: 'NEW',
        notes: [{ content: 'Test note' }]
      });
    });

    it('should throw error if lead not found', async () => {
      mockPrismaService.lead.findUnique.mockResolvedValue(null);

      await expect(service.generateAiSummary('lead-1')).rejects.toThrow('Lead with ID lead-1 not found');
    });
  });
});