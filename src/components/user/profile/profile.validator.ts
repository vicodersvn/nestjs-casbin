import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateProfileParams {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  username: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  last_name: string;
}

export class UpdatePasswordParams {
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  old_password: string;
}
