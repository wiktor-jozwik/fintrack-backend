import { IsEmail } from 'class-validator';

export class ResendActivationLinkDto {
  @IsEmail()
  email: string;
}
