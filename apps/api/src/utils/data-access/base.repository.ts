import { AccessControl, ProtectedRepository } from "@bitmetro/accesscontrol";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { AsTable, PostSchema, ProfileRole, ProfileSchema } from "@repo/common";
import { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { Database } from "drizzle/provider";
import * as schemas from 'drizzle/schemas/tables';
import { DoesExtend } from "drizzle/schemas/tables/common";
import { txStore } from "utils/transactor/tx.service";

export type ResourceMap = DoesExtend<Partial<Record<keyof typeof schemas, any>>, {
  profileTable: AsTable<ProfileSchema>;
  postsTable: AsTable<PostSchema>;
}>;

export class BaseRepository extends ProtectedRepository<any, ResourceMap, ProfileRole> {
  constructor(
    private readonly _db: Database
  ) {
    super();

    const ac = this.createConfig();

    ac.grant('admin')
      .manageAll('profileTable')
      .manageAll('postsTable');

    ac.grant('user')
      .manageOwn('profileTable')
      .manageOwn('postsTable');
  }

  protected db(): Database {
    return txStore.getStore() ?? this._db;
  }

  protected baseDb() { return this._db };

  private createConfig() {
    const ac = new AccessControl<User, ResourceMap, ProfileRole>({
      getUserRole: (user) => user.email === 'alastairzotos@gmail.com' ? 'admin' : 'user', // TODO
      checkOwnership: async (user, _, resource) => resource.userId === user.id,
    });

    this.config({
      accessControl: ac,

      defaultCreate: async (resourceType, value) => {
        return (await this.db().insert(schemas[resourceType as string]).values(value).returning())[0];
      },
      defaultRead: async (resourceType, resourceId) => {
        return await this.db().query[resourceType as string].findFirst({
          where: ({ id }: { id: string }, { eq }) => eq(id, resourceId)
        })
      },
      defaultUpdate: async (resourceType, id, values) => {
        const valuesWithoutDates = { ...values };
        delete valuesWithoutDates.createdAt;
        delete valuesWithoutDates.updatedAt;

        return (await this.db().update(schemas[resourceType as string])
          .set(valuesWithoutDates)
          .where(eq(schemas[resourceType as string].id, id))
          .returning())[0] as any;
      },
      defaultDelete: async (resourceType, id) => {
        await this.db().delete(schemas[resourceType as string]).where(eq(schemas[resourceType as string].id, id))
      },

      throw403(msg) {
        throw new ForbiddenException(msg);
      },

      throw404(msg) {
        throw new NotFoundException(msg);
      },
    })

    return ac;
  }
}
