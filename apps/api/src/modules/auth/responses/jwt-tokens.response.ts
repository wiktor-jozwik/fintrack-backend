import { ApiProperty } from '@nestjs/swagger';

export class JwtTokensResponse {
  @ApiProperty()
  jwtAccessToken: string;

  @ApiProperty()
  jwtRefreshToken: string;
}
