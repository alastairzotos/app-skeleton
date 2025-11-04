import { EmailData } from "../types";

export interface QueueConfig {
  options?: {
    attempts?: number;
    delay?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay?: number;
    };
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
  };
  jobs?: Record<string, any>;
}

export const queues = {
  email: {
    jobs: {
      send_email: {} as EmailData & {
        profileId: string;
      },
      email_admins: {} as EmailData,
    },
  },
} as const satisfies Record<string, QueueConfig>;

export type QueueName = keyof typeof queues;
export type JobType<Q extends QueueName> = keyof typeof queues[Q]['jobs'];

export type JobPayload<Q extends QueueName, J extends JobType<Q>> = typeof queues[Q]['jobs'][J];
