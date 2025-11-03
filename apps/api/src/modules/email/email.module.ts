import { Module } from "@nestjs/common";
import { ResendModule } from "integrations/resend/resend.module";
import { EmailConsumer } from "./email.consumer";
import { EmailService } from "./email.service";

@Module({
  imports: [ResendModule],
  providers: [EmailConsumer, EmailService],
})
export class EmailModule {}
