import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponse {
  @ApiProperty()
  success: boolean;
}
