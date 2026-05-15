import { IsEmail, IsString, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @IsString()
  tenantSlug: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
