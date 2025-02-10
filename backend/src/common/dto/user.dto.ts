import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Role } from '../../entities/role.entity';
import { Promo } from '../../entities/promo.entity';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  snowflake!: number;

  @IsString()
  @IsNotEmpty()
  discordUsername!: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  promoSnowflake?: number;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNumber()
  @IsOptional()
  promoSnowflake?: number;
}

export class UserResponseDto {
  @IsNumber()
  snowflake!: number;

  @IsString()
  discordUsername!: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  status!: boolean;

  @IsOptional()
  roles?: Role[];

  @IsOptional()
  promo?: Promo;
} 