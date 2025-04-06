import { Injectable, Logger } from '@nestjs/common';
import { MockPrismaService } from '../auth/auth.service';

interface SyncOperation {
  type: string;
  modelName: string;
  recordId: string;
  data: any;
  timestamp: string;
}

@Injectable()
export class OfflineSyncService {
  private readonly logger = new Logger(OfflineSyncService.name);

  constructor(private prisma: MockPrismaService) {}

  async syncData(userId: string, data: { deviceId: string; operations: SyncOperation[] }) {
    this.logger.log(`Syncing ${data.operations.length} operations from device ${data.deviceId}`);
    
    const results = [];
    
    // Process each operation
    for (const operation of data.operations) {
      try {
        const result = await this.processOperation(userId, operation);
        results.push({
          success: true,
          operationType: operation.type,
          modelName: operation.modelName,
          recordId: operation.recordId,
          result,
        });
      } catch (error) {
        this.logger.error(`Error processing operation: ${error.message}`, error.stack);
        results.push({
          success: false,
          operationType: operation.type,
          modelName: operation.modelName,
          recordId: operation.recordId,
          error: error.message,
        });
        
        // Log the sync error
        await this.prisma.offlineOperation.create({
          data: {
            userId,
            modelName: operation.modelName,
            recordId: operation.recordId,
            operation: operation.type,
            data: operation.data,
            status: 'FAILED',
            error: error.message,
          }
        });
      }
    }
    
    // Create a sync log entry
    await this.prisma.syncLog.create({
      data: {
        userId,
        deviceId: data.deviceId,
        status: results.every(r => r.success) ? 'SUCCESS' : 'PARTIAL_SUCCESS',
        completedAt: new Date(),
        details: results,
      }
    });
    
    return {
      synced: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      total: results.length,
      results,
    };
  }
  
  private async processOperation(userId: string, operation: SyncOperation) {
    switch (operation.type) {
      case 'CREATE':
        return this.handleCreate(userId, operation);
      case 'UPDATE':
        return this.handleUpdate(userId, operation);
      case 'DELETE':
        return this.handleDelete(userId, operation);
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }
  
  private async handleCreate(userId: string, operation: SyncOperation) {
    // Implementation depends on the model type
    // This is a simplified version
    const model = this.getModelForName(operation.modelName);
    if (!model) {
      throw new Error(`Unknown model: ${operation.modelName}`);
    }
    
    // Add userId to the data
    const data = { ...operation.data, userId };
    
    return model.create({
      data,
    });
  }
  
  private async handleUpdate(userId: string, operation: SyncOperation) {
    const model = this.getModelForName(operation.modelName);
    if (!model) {
      throw new Error(`Unknown model: ${operation.modelName}`);
    }
    
    // Check ownership
    const record = await model.findFirst({
      where: {
        id: operation.recordId,
        userId,
      },
    });
    
    if (!record) {
      throw new Error(`Record not found or not owned by user: ${operation.recordId}`);
    }
    
    return model.update({
      where: { id: operation.recordId },
      data: operation.data,
    });
  }
  
  private async handleDelete(userId: string, operation: SyncOperation) {
    const model = this.getModelForName(operation.modelName);
    if (!model) {
      throw new Error(`Unknown model: ${operation.modelName}`);
    }
    
    // Check ownership
    const record = await model.findFirst({
      where: {
        id: operation.recordId,
        userId,
      },
    });
    
    if (!record) {
      throw new Error(`Record not found or not owned by user: ${operation.recordId}`);
    }
    
    return model.delete({
      where: { id: operation.recordId },
    });
  }
  
  private getModelForName(modelName: string) {
    // Map model names to Prisma models
    const modelMap: Record<string, any> = {
      'lead': this.prisma.lead,
      'note': this.prisma.note,
      'itinerary': this.prisma.itinerary,
      'activity': this.prisma.activity,
    };
    
    const key = modelName.toLowerCase();
    return modelMap[key] || null;
  }
}