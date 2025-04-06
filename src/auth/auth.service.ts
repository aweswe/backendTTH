import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MockPrismaService {
  user = {
    findMany: async (args?: any) => [{ id: '1', email: 'test@example.com', password: bcrypt.hashSync('password123', 10), role: { id: '1', name: 'admin' } }],
    findUnique: async (args: any) => (args.where.email === 'test@example.com' ? { id: '1', email: 'test@example.com', password: bcrypt.hashSync('password123', 10), role: { id: '1', name: 'admin' } } : null),
    create: async (args: any) => ({ id: '2', ...args.data, role: { id: '1', name: 'admin' } }),
    update: async (args: any) => ({ id: args.where.id, ...args.data, role: { id: '1', name: 'admin' } }),
    delete: async (args: any) => ({ id: args.where.id }),
  };

  pdfTheme = {
    findMany: async () => [{ id: '1', name: 'Default Theme', createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', primaryColor: '#000000', fontFamily: 'Helvetica', fontSize: 12 }],
    findUnique: async (args: any) => (args.where.id === '1' ? { id: '1', name: 'Default Theme', createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', primaryColor: '#000000', fontFamily: 'Helvetica', fontSize: 12 } : null),
    create: async (args: any) => ({ id: '2', ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async (args: any) => ({
      id: args.where.id,
      name: 'Default Theme',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      primaryColor: '#000000',
      fontFamily: 'Helvetica',
      fontSize: 12,
    }),
  };

  itinerary = {
    findUnique: async (args: any) => (args.where.id === '1' ? { id: '1', name: 'Sample Itinerary', lead: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1234567890' }, activities: [{ name: 'Activity 1', location: 'Location 1', startTime: new Date(), endTime: new Date(), description: 'Description 1' }] } : null),
  };

  offlineOperation = {
    create: async (args: any) => ({ id: '1', ...args.data }),
  };

  syncLog = {
    create: async (args: any) => ({ id: '1', ...args.data }),
  };

  lead = {
    create: async (args: any) => ({ id: '1', ...args.data }),
    findMany: async () => [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }],
    findUnique: async (args: any) => (args.where.id === '1' ? { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' } : null),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async (args: any) => ({ id: args.where.id }),
  };

  note = {
    create: async (args: any) => ({ id: '1', ...args.data }),
    findMany: async () => [{ id: '1', content: 'Sample Note', leadId: '1', userId: '1' }],
  };

  activity = {
    findFirst: async (args: any) => (args.where.id === '1' ? { id: '1', name: 'Sample Activity' } : null),
    delete: async (args: any) => ({ id: args.where.id }),
  };

  findRoleById = async (roleId: string) => (roleId === '1' ? { id: '1', name: 'admin' } : null);

  userCreate = async (data: any) => ({ id: '2', ...data });
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: MockPrismaService, // Use the mock service
  ) {}

  private dummyUser = {
    email: 'testuser@example.com',
    password: bcrypt.hashSync('password123', 10), // Hashed password
  };

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result; // Return user info without the password
    }

    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const role = await this.prisma.findRoleById(data.roleId);
    if (!role) {
      throw new Error('Invalid role ID');
    }

    const user = await this.prisma.userCreate({
      ...data,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }
}