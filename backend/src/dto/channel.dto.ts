export class CreateChannelDto {
  snowflake: string;
  name: string;
  is_public: boolean;
  promos_snowflakes: string[];
}

export class UpdateChannelDto {
  name?: string;
  is_public?: boolean;
  promos_snowflakes?: string[];
} 