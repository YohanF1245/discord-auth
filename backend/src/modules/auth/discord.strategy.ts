import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { discordConfig } from '../../config/discord.config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super({
      clientID: discordConfig.clientID,
      clientSecret: discordConfig.clientSecret,
      callbackURL: discordConfig.callbackURL,
      scope: discordConfig.scope,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id: snowflake, username: discord_username, email } = profile;
    
    return {
      snowflake,
      discord_username,
      email,
      accessToken,
    };
  }
} 