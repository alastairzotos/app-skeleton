import { JobPayload } from '@repo/common';
import { Job } from 'bullmq';
import { EmailService } from 'modules/email/email.service';
import { BaseConsumer, createConsumer } from 'utils/consumer/base.consumer';
import { InjectWinston } from 'utils/logger/logger';
import { Logger } from 'winston';

const { Consumer, Process } = createConsumer('email');

@Consumer()
export class EmailConsumer extends BaseConsumer {
  constructor(
    @InjectWinston() protected readonly logger: Logger,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  @Process('send_email')
  async handleSendEmail({ data: { profileId, ...data }}: Job<JobPayload<'email', 'send_email'>>) {
    return await this.emailService.sendEmail(profileId, data);
  }

  @Process('email_admins')
  async handleEmailAdmins({ data }: Job<JobPayload<'email', 'email_admins'>>) {
    return await this.emailService.emailAdmins(data);
  }
}
