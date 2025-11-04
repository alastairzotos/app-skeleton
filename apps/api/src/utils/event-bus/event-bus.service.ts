import { getQueueToken } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Interval } from "@nestjs/schedule";
import { JobType, QueueName, queues } from "@repo/common";
import { Queue } from "bullmq";
import { eq, inArray } from "drizzle-orm";
import { Database, InjectDb } from "drizzle/provider";
import { outboxTable } from "drizzle/schemas";
import { BaseRepository } from "utils/data-access/base.repository";
import { InjectWinston } from "utils/logger/logger";

const BATCH_SIZE = 100;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type JobPayloads = UnionToIntersection<{
  [Q in QueueName]: typeof queues[Q]
}[QueueName]>;

@Injectable()
export class EventBus extends BaseRepository {
  private readonly queueCache = new Map<string, Queue>();

  constructor(
    @InjectDb() db: Database,
    @InjectWinston() private readonly logger: Logger,
    private readonly moduleRef: ModuleRef,
  ) {
    super(db);
  }

  async emit<Q extends QueueName, J extends JobType<Q>>(
    queue: Q, 
    type: J, 
    payload: J extends keyof JobPayloads['jobs'] ? JobPayloads['jobs'][J] : never
  ) {
    await this.db().insert(outboxTable).values({ 
      queue: queue as string, 
      type: type as string, 
      payload 
    });
  }

  @Interval(5000)
  private async flushEvents() {
    while (true) {
      const claimed = await this.baseDb().transaction(async (tx) => {
        const selected = await tx
          .select({ id: outboxTable.id })
          .from(outboxTable)
          .where(eq(outboxTable.claimed, false))
          .orderBy(outboxTable.createdAt)
          .limit(BATCH_SIZE)
          .for('update', { skipLocked: true });

        if (!selected.length) return [];

        const ids = selected.map(r => r.id);

        return await tx
          .update(outboxTable)
          .set({ claimed: true })
          .where(inArray(outboxTable.id, ids))
          .returning();
      });

      if (!claimed.length) break;

      const successIds: string[] = [];
      const toUnclaimIds: string[] = [];

      for (const event of claimed) {
        try {
          const queue = this.getQueue(event.queue);

          if (!queue) {
            this.logger.error(`Invalid queue: ${event.queue}`);
            toUnclaimIds.push(event.id);
            continue;
          }

          await queue.add(event.type, event.payload, { jobId: event.id });
          successIds.push(event.id);
        } catch (e) {
          this.logger.error(`Dispatch failed [${event.id}]:`, e);
          toUnclaimIds.push(event.id);
        }
      }

      if (successIds.length) {
        await this.baseDb().delete(outboxTable).where(inArray(outboxTable.id, successIds));
      }

      if (toUnclaimIds) {
        await this.baseDb().update(outboxTable).set({ claimed: false }).where(inArray(outboxTable.id, toUnclaimIds));
      }
    }
  }

  private getQueue(name: string): Queue {
    let q = this.queueCache.get(name);
    if (!q) {
      q = this.moduleRef.get<Queue>(getQueueToken(name), { strict: false });
      if (q) this.queueCache.set(name, q);
    }
    return q;
  }
}
