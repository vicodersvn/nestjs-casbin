import { IsString, IsNotEmpty, MinLength, IsOptional, MaxLength, IsBoolean, IsEmail } from 'class-validator';

export class AdminCreateUserBodyParam {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  first_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  last_name: string;
}

export class AdminChangeUserBodyParam {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  notify_user: boolean;
}

export class UserSendMailReportParams {
  @IsEmail()
  @IsNotEmpty()
  toEmail: string;

  @IsNotEmpty()
  linkReport: string;
}
