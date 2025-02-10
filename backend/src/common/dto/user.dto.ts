import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

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
  roles?: any[]; // TODO: Remplacer par RoleDto[]

  @IsOptional()
  promo?: any; // TODO: Remplacer par PromoDto
} 