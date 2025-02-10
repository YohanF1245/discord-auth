import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreatePromoDto {
  @IsNumber()
  @IsNotEmpty()
  snowflake!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  roles_snowflakes!: string[];

  @IsArray()
  @IsString({ each: true })
  channels_snowflakes!: string[];
}

export class UpdatePromoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  roles_snowflakes!: string[];

  @IsArray()
  @IsString({ each: true })
  channels_snowflakes!: string[];
}

export class PromoResponseDto {
  @IsNumber()
  snowflake!: number;

  @IsString()
  name!: string;

  @IsArray()
  roles!: any[]; // TODO: Remplacer par RoleDto[]

  @IsArray()
  channels!: any[]; // TODO: Remplacer par ChannelDto[]

  @IsArray()
  users!: any[]; // TODO: Remplacer par UserDto[]
} 