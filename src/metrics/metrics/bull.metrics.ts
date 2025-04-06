import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Gauge } from 'prom-client';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BullMetrics {
  constructor(
    @InjectQueue('default')
    private readonly queue: Queue,
    @InjectMetric('bull_queue_size')
    private readonly queueSize: Gauge<string>,
    @InjectMetric('bull_active_jobs')
    private readonly activeJobs: Gauge<string>,
    @InjectMetric('bull_waiting_jobs')
    private readonly waitingJobs: Gauge<string>,
    @InjectMetric('bull_completed_jobs')
    private readonly completedJobs: Gauge<string>,
    @InjectMetric('bull_failed_jobs')
    private readonly failedJobs: Gauge<string>,
  ) {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Initialize all metrics to 0
    this.queueSize.set(0);
    this.activeJobs.set(0);
    this.waitingJobs.set(0);
    this.completedJobs.set(0);
    this.failedJobs.set(0);
  }

  async updateMetrics() {
    const counts = await this.queue.getJobCounts();
    
    this.queueSize.set(counts.waiting + counts.active + counts.delayed);
    this.activeJobs.set(counts.active);
    this.waitingJobs.set(counts.waiting);
    this.completedJobs.set(counts.completed);
    this.failedJobs.set(counts.failed);
  }

  async getQueueStats() {
    return {
      queued: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
    };
  }
} 