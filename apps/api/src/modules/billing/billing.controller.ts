import { Controller, Delete, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { PriceTier } from "@repo/common";
import { User } from "@supabase/supabase-js";
import { Principal } from "decorators";
import { Request, Response } from "express";
import { AuthGuard } from "modules/auth/auth.guard";
import { BillingService } from "./billing.service";

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
  ) { }

  @Post('create-checkout-session/:tier')
  @UseGuards(AuthGuard)
  async createCheckoutSession(
    @Principal() user: User,
    @Param('tier') tier: PriceTier,
  ) {
    return this.billingService.createCheckoutSession(user, tier);
  }

  @Delete('cancel-subscription')
  @UseGuards(AuthGuard)
  async cancelSubscription(
    @Principal() user: User,
  ) {
    await this.billingService.cancelSubscription(user);
  }

  @Post('portal')
  @UseGuards(AuthGuard)
  async createPortalSession(
    @Principal() user: User,
  ) {
    return await this.billingService.createPortalSession(user);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.billingService.handleWebhook(req.body, req.headers['stripe-signature'] as string);
    res.status(200).json(result);
  }
}
