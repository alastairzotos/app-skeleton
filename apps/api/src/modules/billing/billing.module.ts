import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "drizzle/provider";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { StripeModule } from "integrations/stripe/stripe.module";
import { ProfilesModule } from "../profiles/profiles.module";

@Module({
  imports: [
    ConfigModule,
    DrizzleModule,
    ProfilesModule,
    StripeModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
