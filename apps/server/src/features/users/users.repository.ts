import { Injectable } from "@nestjs/common";
import { Database, InjectDb } from "drizzle/provider";
import { UserTable } from "drizzle/schemas";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDb() private readonly db: Database,
  ) {}

  async registerWithEmailAndPassword(email: string, hashedPassword: string) {
    const [user] = await this.db
      .insert(UserTable)
      .values({ email, hashedPassword })
      .returning();

    return user;
  }

  async getByEmailWithPassword(email: string) {
    return await this.db.query.UserTable.findFirst({ where: (t, { eq }) => eq(t.email, email) });
  }
}
