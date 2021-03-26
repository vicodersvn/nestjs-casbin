import { IsString, IsNotEmpty } from 'class-validator';

export class SendResetLinkParams {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordParams {
  @IsString()
  @IsNotEmpty()
  token: string;
  password: string;
}
