import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  sendConfirmationEmail(email: string, url: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your email address',
      template: './email-confirmation',
      context: {
        email,
        url,
      },
    });
  }
}
