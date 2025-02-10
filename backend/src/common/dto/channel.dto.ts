import { IsString, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  snowflake!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsBoolean()
  is_public!: boolean;

  @IsArray()
  @IsString({ each: true })
  promos_snowflakes!: string[];
}

export class UpdateChannelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsBoolean()
  is_public!: boolean;

  @IsArray()
  @IsString({ each: true })
  promos_snowflakes!: string[];
}

export class ChannelResponseDto {
  @IsString()
  snowflake!: string;

  @IsString()
  name!: string;

  @IsBoolean()
  is_public!: boolean;

  @IsArray()
  promos!: any[]; // TODO: Remplacer par PromoDto[]
} 