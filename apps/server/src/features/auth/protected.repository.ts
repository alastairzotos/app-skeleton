import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { AsTable, PostSchema, User, UserRoles } from "@repo/models";
import { AccessControl, ProtectedRepository } from "@repo/rbac";
import { Database } from "drizzle/provider";
import { DoesExtend } from "drizzle/schemas/tables/common";
import * as schemas from 'drizzle/schemas/tables';
import { eq } from "drizzle-orm";

export type ResourceMap = DoesExtend<Partial<Record<keyof typeof schemas, any>>, {
  postsTable: AsTable<PostSchema>;
}>;

export class ProtectedRepo extends ProtectedRepository<User, ResourceMap, UserRoles> {
  constructor(
    private readonly _database: Database
  ) {
    super();

    const ac = this.createConfig();

    ac.grant('user')
      .manageOwn('postsTable')
  }

  private createConfig() {
    const ac = new AccessControl<User, ResourceMap, UserRoles>({
      getUserRole: (user) => user.role,
      checkOwnership: (user, resourceType, resource) => user.id === resource.ownerId,
    });

    this.config({
      accessControl: ac,
      
      defaultCreate: async (resourceType, value) => {
        return (await this._database.insert(schemas[resourceType as string]).values(value).returning())[0];
      },
      defaultRead: async (resourceType, resourceId) => {
        return await this._database.query[resourceType as string].findFirst({
          where: ({ id }: { id: string }, { eq }) => eq(id, resourceId)
        })
      },
      defaultUpdate: async (resourceType, values) => {
        return (await this._database.update(schemas[resourceType as string]).set(values).returning())[0];
      },
      defaultDelete: async (resourceType, id) => {
        await this._database.delete(schemas[resourceType as string]).where(eq(schemas[resourceType as string].id, id))
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
