import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JobType, QueueName } from '@repo/common';
import { Job } from 'bullmq';
import { Logger } from 'winston';

export const PROCESS_METADATA = 'bullmq:process';

export interface ProcessOptions {
  name?: string;
  concurrency?: number;
}

export abstract class BaseConsumer extends WorkerHost {
  private readonly reflector = new Reflector();
  private readonly processHandlers = new Map<string, Function>();
  protected abstract logger: Logger;

  constructor() {
    super();
    this.discoverProcessHandlers();
  }

  async process(job: Job): Promise<any> {
    const handler = this.processHandlers.get(job.name);
    
    if (!handler) {
      this.logger?.error(`No handler found for job type: ${job.name}`);
      throw new Error(`No handler found for job type: ${job.name}`);
    }

    try {
      return await handler.call(this, job);
    } catch (error) {
      this.logger?.error(`Error processing job ${job.name}:`, error);
      throw error;
    }
  }

  private discoverProcessHandlers() {
    const prototype = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(prototype);

    for (const methodName of methodNames) {
      const method = prototype[methodName];
      
      if (typeof method === 'function' && methodName !== 'constructor') {
        const processOptions: ProcessOptions = this.reflector.get(PROCESS_METADATA, method);
        
        if (processOptions) {
          const jobName = processOptions.name || methodName;
          this.processHandlers.set(jobName, method);
        }
      }
    }
  }
}

export const createConsumer = <Q extends QueueName>(queueName: Q) => ({
  Consumer: () => Processor(queueName),
  Process: (jobType: JobType<Q>, concurrency?: number) => SetMetadata(PROCESS_METADATA, { name: jobType as string, concurrency }),
});
