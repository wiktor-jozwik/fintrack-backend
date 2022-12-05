import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@app/api/src/modules/email';

@Injectable()
export class UsersMailerService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  sendActivationMail(email: string, token: string): void {
    this.emailService.sendConfirmationEmail(
      email,
      `${this.configService.get('API_URL')}/users/confirm_email?token=${token}`,
    );
  }
}
