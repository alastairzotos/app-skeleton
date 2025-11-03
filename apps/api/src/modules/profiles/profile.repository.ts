import { Injectable } from "@nestjs/common";
import { Profile } from "@repo/common";
import { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { Database, InjectDb } from "drizzle/provider";
import { profileTable } from "drizzle/schemas";
import { BaseRepository } from "utils/data-access/base.repository";

@Injectable()
export class ProfilesRepository extends BaseRepository {
  constructor(
    @InjectDb() db: Database,
  ) {
    super(db);
  }

  async getProfileById(id: string) {
    return await this.db().query.profileTable.findFirst({
      where: (t, { eq }) => eq(t.id, id),
    })
  }

  async createProfile(user: User) {
    return await this.for(user).create.profileTable({
      id: user.id,
      userId: user.id,
      role: 'user',
    });
  }

  async updateProfileById(id: string, profile: Partial<Profile>) {
    await this.db().update(profileTable).set(profile).where(eq(profileTable.id, id));
  }

  async updateProfileBySubscriptionId(id: string, profile: Partial<Profile>) {
    await this.db().update(profileTable).set(profile).where(eq(profileTable.stripeSubscriptionId, id));
  }

  async deleteProfile(user: User, id: string) {
    return await this.for(user).delete.profileTable(id);
  }
}
