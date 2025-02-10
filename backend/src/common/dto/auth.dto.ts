import { IsString, IsNotEmpty } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token!: string;

  @IsString()
  @IsNotEmpty()
  user!: any; // TODO: Remplacer par UserDto
}

export class DiscordAuthDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
} 