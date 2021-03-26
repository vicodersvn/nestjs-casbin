import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator';

export class SendResetLinkParams {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordParams {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
  @ApiProperty()
  @IsString()
  @MaxLength(60)
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
