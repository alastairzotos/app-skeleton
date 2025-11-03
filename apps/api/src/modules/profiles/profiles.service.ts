import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Profile, ProfileAction } from "@repo/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@supabase/supabase-js";
import { getSupabase } from "modules/auth/supabase-admin";
import { StripeService } from "integrations/stripe/stripe.service";
import { InjectWinston } from "utils/logger/logger";
import { Logger } from "winston";
import { ProfilesRepository } from "./profile.repository";
import { EventBus } from "utils/event-bus/event-bus.service";
import { TxService } from "utils/transactor/tx.service";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectWinston() private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly eventBus: EventBus,
    private readonly tx: TxService,
    private readonly stripeService: StripeService,
    private readonly profilesRepo: ProfilesRepository,
  ) { }

  async getProfileById(id: string) {
    return await this.profilesRepo.getProfileById(id);
  }

  async getOrCreateProfile(user: User) {
    this.logger.info('get_or_create_profile', { id: user.id });

    const existingProfile = await this.getProfileById(user.id);

    if (existingProfile) {
      return existingProfile;
    }

    return await this.createProfile(user);
  }

  async createProfile(user: User) {
    this.logger.info('create_profile', { id: user.id });

    const createdProfile = await this.tx.transaction(async (tx) => {
      const profile = await this.profilesRepo.createProfile(user);

      await this.eventBus.emit('email', 'send_email', {
        profileId: profile.id,
        subject: `Welcome to ${this.config.get('APP_NAME')}!`,
        content: `
          <h1>Welcome${user?.user_metadata?.full_name ? ` ${user?.user_metadata?.full_name}` : ''}!</h1>
        `
      });

      await this.eventBus.emit('email', 'email_admins', {
        subject: `${this.config.get('APP_NAME')} signup`,
        content: `
          <p>A new user has signed up</p>
          <p>ID: ${profile.id}</p>
        `
      });

      return profile;
    });

    return createdProfile;
  }

  async updateProfileById(id: string, profile: Partial<Profile>) {
    this.logger.info('update_profile_by_id', { id, profile });

    await this.profilesRepo.updateProfileById(id, profile);
  }

  async updateProfileBySubscriptionId(id: string, profile: Partial<Profile>) {
    this.logger.info('update_profile_by_subscription_id', { id, profile });

    await this.profilesRepo.updateProfileBySubscriptionId(id, profile);
  }

  async deleteProfile(user: User, id: string) {
    this.logger.info('delete_profile', { id });

    const profile = await this.getProfileById(id);

    if (profile.stripeSubscriptionId) {
      try {
        await this.stripeService.cancelSubscription(profile.stripeSubscriptionId);
      } catch (e) {
        this.logger.error('cancel_subscription_error', { message: e.message });
      }
    }

    const { error } = await getSupabase().auth.admin.deleteUser(id);
    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    await this.profilesRepo.deleteProfile(user, id);
  }

  async checkProfileCanPerformAction(user: User, action: ProfileAction, resourceId?: string) {
    this.logger.info('check_profile_can_perform_action', { userId: user.id, action, resourceId });

    const profile = await this.profilesRepo.getProfileById(user.id);

    if (!profile) {
      throw new UnauthorizedException('Invalid profile ID');
    }

    if (profile.role === 'admin') {
      return;
    }

    // Return early if okay to perform action
    switch (action) {
      case 'create-post':
        return;
    }

    this.logger.info('profile_action_exceeds_limits', { userId: user.id, action, resourceId });
    throw new ForbiddenException("exceeds_limits");
  }
}
