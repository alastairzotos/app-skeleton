import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PriceTier, urls } from "@repo/common";
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private priceIdTable: Record<PriceTier, string | null>;
  private webhookSecret: string;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    });

    this.priceIdTable = JSON.parse(config.get('STRIPE_PRICE_IDS'));

    this.webhookSecret = config.get('STRIPE_WEBHOOK_SECRET');
  }

  async createCheckoutSession(userId: string, tier: PriceTier) {
    const priceId = this.priceIdTable[tier];

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${this.config.get('CLIENT_URL')}${urls.billing()}`,
      cancel_url: `${this.config.get('CLIENT_URL')}${urls.billing()}`,
      metadata: {
        userId,
        tier,
      }
    });

    return session.url;
  }

  async cancelSubscription(subscriptionId: string) {
    await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async createPortalSession(customerId: string) {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${this.config.get('CLIENT_URL')}${urls.billing()}`,
    });
  }

  async constructEvent(body: Buffer, signature: string) {
    return await this.stripe.webhooks.constructEventAsync(
      body,
      signature,
      this.webhookSecret,
    );
  }

  async retrieveSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }
}
