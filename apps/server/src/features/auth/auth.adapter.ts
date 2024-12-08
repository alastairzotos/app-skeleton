import { PersonaAdapter } from "@bitmetro/persona-node";
import { Injectable } from "@nestjs/common";
import { UserSchema } from "@repo/models";
import { Database, InjectDb } from "drizzle/provider";
import { usersTable } from "drizzle/schemas";

@Injectable()
export class AuthAdapter implements PersonaAdapter<UserSchema> {
  constructor(
    @InjectDb()
    private readonly db: Database
  ) {}

  async exchangeJwtPayloadForUser(payload: { email: string; }): Promise<UserSchema> {
    return await this.getUserByEmail(payload.email);
  }

  async getUserByEmail(email: string): Promise<UserSchema> {
    return await this.db.query.usersTable.findFirst({
      where: (t, { eq }) => eq(t.email, email),
    });
  }

  async createUser(email: string, details: any): Promise<UserSchema> {
    const created = await this.db.insert(usersTable).values({
      email,
      name: details.first_name,
    }).returning();

    return created[0];
  }
}
