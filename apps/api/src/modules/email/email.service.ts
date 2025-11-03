import { Injectable } from '@nestjs/common';
import { EmailData } from '@repo/common';
import { ResendService } from 'integrations/resend/resend.service';
import { getSupabase } from 'modules/auth/supabase-admin';

@Injectable()
export class EmailService  {
  constructor(
    private readonly resendService: ResendService,
  ) { }

  async sendEmail(profileId: string, data: EmailData) {
    const recipient = await getSupabase().auth.admin.getUserById(profileId);

    if (!recipient) return;

    const to = recipient.data.user.email;
    if (!to) return;

    // Check they have opted-in to receive emails here
    await this.resendService.send(to, data);
  }

  async emailAdmins(data: EmailData) {
    await this.resendService.send('alastairzotos@gmail.com', data);
  }
}
