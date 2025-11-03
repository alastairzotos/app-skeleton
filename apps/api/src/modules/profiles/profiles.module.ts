import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "drizzle/provider";
import { ProfilesRepository } from "./profile.repository";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { StripeModule } from "integrations/stripe/stripe.module";
import { EventBusModule } from "utils/event-bus/event-bus.module";
import { TxModule } from "utils/transactor/tx.module";

@Module({
  imports: [
    ConfigModule,
    DrizzleModule,
    StripeModule,
    EventBusModule,
    TxModule,
  ],
  providers: [ProfilesService, ProfilesRepository],
  exports: [ProfilesService, ProfilesRepository],
  controllers: [ProfilesController],
})
export class ProfilesModule { }
