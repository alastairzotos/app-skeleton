import { Module } from "@nestjs/common";
import { DrizzleModule } from "drizzle/provider";
import { EventBus } from "./event-bus.service";

@Module({
  imports: [DrizzleModule],
  providers: [EventBus],
  exports: [EventBus],
})
export class EventBusModule {}
