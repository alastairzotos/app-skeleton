import { Injectable } from "@nestjs/common";
import { type Database, type DbTx, InjectDb } from "drizzle/provider";
import { AsyncLocalStorage } from "node:async_hooks";

export const txStore = new AsyncLocalStorage<DbTx>();

@Injectable()
export class TxService {
  constructor(
    @InjectDb() private _db: Database,
  ) { }

  async transaction<T = any>(fn: (tx: DbTx) => Promise<T>) {
    const existing = txStore.getStore();
    if (existing) {
      return fn(existing);
    }

    return this._db.transaction(async (tx: DbTx) => txStore.run(tx, () => fn(tx)));
  }
}
