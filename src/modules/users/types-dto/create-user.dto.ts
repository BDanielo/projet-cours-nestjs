import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from './user-role.type';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Mot de passe de 6 caractères ou plus.',
  })
  password: string;

  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: string;
}
