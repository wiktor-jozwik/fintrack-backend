export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
