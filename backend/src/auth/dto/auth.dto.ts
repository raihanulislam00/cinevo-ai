import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() @MinLength(2) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/) password!: string;
}
export class LoginDto { @IsEmail() email!: string; @IsString() @IsNotEmpty() password!: string; }
export class RefreshDto { @IsString() @IsNotEmpty() refreshToken!: string; }
export interface AuthenticatedUser { id: string; email: string; }
