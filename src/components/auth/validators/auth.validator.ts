import { IsString, IsNotEmpty } from 'class-validator';

export class LoginGoogleParams {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
