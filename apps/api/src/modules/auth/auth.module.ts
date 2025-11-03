import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "drizzle/provider";
import { AuthGuard } from "./auth.guard";

@Global()
@Module({
  imports: [
    ConfigModule,
    DrizzleModule,
  ],
  exports: [AuthGuard],
  providers: [AuthGuard],
})
export class AuthModule {}
