import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PriceTier } from "@repo/common";
import { User } from "@supabase/supabase-js";
import { StripeService } from "integrations/stripe/stripe.service";
import Stripe from "stripe";
import { InjectWinston } from "utils/logger/logger";
import { Logger } from "winston";
import { ProfilesService } from "../profiles/profiles.service";

@Injectable()
export class BillingService {
  constructor(
    @InjectWinston() private readonly logger: Logger,
    private readonly stripeService: StripeService,
    private readonly profileService: ProfilesService,
  ) { }

  async createCheckoutSession(user: User, tier: PriceTier) {
    this.logger.info('create_checkout_session');

    const profile = await this.profileService.getProfileById(user.id);
    
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.stripeSubscriptionId && profile.stripeSubscriptionStatus === 'active' && profile.tier === tier) {
      throw new ConflictException(`You already have an active subscription for the "${tier}" plan`);
    }

    const session = await this.stripeService.createCheckoutSession(user.id, tier);
    this.logger.info('checkout_session_created');

    return session;
  }

  async cancelSubscription(user: User) {
    this.logger.info('cancel_subscription');

    const profile = await this.profileService.getProfileById(user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!profile.stripeCustomerId) {
      throw new BadRequestException('User does not have an active Stripe subscription');
    }
    await this.stripeService.cancelSubscription(profile.stripeSubscriptionId);
    this.logger.info('subscription_cancelled');

  }

  async createPortalSession(user: User) {
    this.logger.info('create_portal_session');

    const profile = await this.profileService.getProfileById(user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!profile.stripeCustomerId) {
      throw new BadRequestException('User does not have an active Stripe subscription');
    }
    const portal = await this.stripeService.createPortalSession(profile.stripeCustomerId);
    this.logger.info('portal_session_created');

    return portal.url;
  }

  async handleWebhook(body: Buffer, signature: string) {
    this.logger.info('stripe_webhook_received');

    const event = await this.stripeService.constructEvent(body, signature);
    this.logger.info('stripe_event', { type: event.type });

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          const userId = session.metadata?.userId as string;
          const tier = session.metadata?.tier as PriceTier;
          const subscription = await this.stripeService.retrieveSubscription(session.subscription as string) as Stripe.Subscription;

          await this.profileService.updateProfileById(userId, {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            tier,
            stripeSubscriptionStatus: subscription.status,
            nextBillingDate: new Date(subscription.items.data[0].current_period_end * 1000),
          });

          this.logger.info('checkout_session_completed', { sessionId: session.id });

          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object;

          const subscriptionId = invoice.parent.subscription_details.subscription as string;

          await this.profileService.updateProfileBySubscriptionId(subscriptionId, {
            nextBillingDate: new Date(invoice.period_end * 1000),
          });

          this.logger.info('invoice_paid', { invoiceId: invoice.id });
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;

          await this.profileService.updateProfileBySubscriptionId(subscription.id, {
            stripeSubscriptionStatus: 'canceled',
            nextBillingDate: null,
          });

          this.logger.info('customer_subscription_deleted', { subscriptionId: subscription.id });
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object;
          this.logger.info('invoice_payment_failed', { invoiceId: invoice.id });
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          this.logger.info('customer_subscription_updated', { subscriptionId: subscription.id });
          break;
        }
      }
    } catch (error) {
      this.logger.error('stripe_webhook_error', { error: error.message });
      throw new BadRequestException('Invalid webhook event');
    }

    return { received: true };
  }
}
