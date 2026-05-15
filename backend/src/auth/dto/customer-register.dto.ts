import { IsEmail, IsString, MinLength } from 'class-validator';

export class CustomerRegisterDto {
  @IsString()
  tenantSlug: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
