import { EmailData } from "../types";

export const queues = {
  email: {
    send_email: {} as EmailData & {
      profileId: string;
    },
    email_admins: {} as EmailData,
  },
} as const satisfies Record<string, Record<string, any>>;

export type QueueName = keyof typeof queues;
export type JobType<Q extends QueueName> = keyof typeof queues[Q];

export type JobPayload<Q extends QueueName, J extends JobType<Q>> = typeof queues[Q][J];
