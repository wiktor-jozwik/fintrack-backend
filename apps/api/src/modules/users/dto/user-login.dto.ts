import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UserLoginDto {
  @ApiModelProperty()
  @IsEmail()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
