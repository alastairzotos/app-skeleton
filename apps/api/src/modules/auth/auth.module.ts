import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "drizzle/provider";
import { AuthGuard } from "./auth.guard";
import { AdminGuard } from "./admin.guard";

@Global()
@Module({
  imports: [
    ConfigModule,
    DrizzleModule,
  ],
  exports: [AuthGuard, AdminGuard],
  providers: [AuthGuard, AdminGuard],
})
export class AuthModule {}
