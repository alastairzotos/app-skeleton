import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailData } from '@repo/common';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { Resend } from 'resend';
import { InjectWinston } from 'utils/logger/logger';
import { Logger } from "winston";

@Injectable()
export class ResendService  {
  private resend: Resend;

  constructor(
    @InjectWinston() protected readonly logger: Logger,
    private readonly config: ConfigService
  ) {
    this.resend = new Resend(this.config.get('RESEND_API_KEY'));
  }

  async send(to: string, { subject, content }: EmailData) {
    this.logger.info('send_email', { to, subject });

    if (this.config.get('NODE_ENV') === 'development') {
      const outputPath = path.resolve(process.cwd(), 'test-emails');
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      } else {
        fsExtra.emptyDirSync(outputPath);
      }

      fs.writeFileSync(
        path.resolve(outputPath, `${subject}.html`),
        content,
        'utf-8',
      );
    } else {
      try {
        await this.resend.emails.send({
          from: "info@neuralsplit.com",
          to,
          subject,
          html: content,
        })
      } catch (err) {
        this.logger.error('send_email_error', { error: err?.message });
      }
    }
  }
}