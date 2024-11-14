import { Injectable } from "@nestjs/common";
import { PostSchema, User } from "@repo/models";
import { Database, InjectDb } from "drizzle/provider";
import { ProtectedRepo } from "features/auth/protected.repository";

@Injectable()
export class AuthTestRepository {
  private repo: ProtectedRepo;

  constructor(
    @InjectDb() db: Database,
  ) {
    this.repo = new ProtectedRepo(db);
  }

  async createPost(user: User, post: PostSchema) {
    return await this.repo.create.postsTable(post).for(user);
  }

  async getPostById(user: User, id: string) {
    return await this.repo.read.postsTable(id).for(user);
  }

  async updatePost(user: User, id: string, post: Partial<PostSchema>) {
    return await this.repo.update.postsTable(id).for(user).with(post);
  }

  async deletePost(user: User, id: string) {
    await this.repo.delete.postsTable(id).for(user);
  }
}
