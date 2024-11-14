import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "drizzle/provider";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { AuthAdapter } from "./auth.adapter";

@Global()
@Module({
  imports: [
    ConfigModule,
    DrizzleModule,
  ],
  exports: [AuthService, AuthAdapter, AuthGuard],
  providers: [AuthService, AuthAdapter, AuthGuard],
})
export class AuthModule {}
