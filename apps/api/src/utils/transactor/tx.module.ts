import { Module } from "@nestjs/common";
import { DrizzleModule } from "drizzle/provider";
import { TxService } from "./tx.service";

@Module({
  imports: [DrizzleModule],
  providers: [TxService],
  exports: [TxService],
})
export class TxModule {}
