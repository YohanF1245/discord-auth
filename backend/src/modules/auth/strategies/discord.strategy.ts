import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptionsWithRequest } from 'passport-discord';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const options: StrategyOptionsWithRequest = {
      clientID: configService.get('DISCORD_CLIENT_ID') ?? '',
      clientSecret: configService.get('DISCORD_CLIENT_SECRET') ?? '',
      callbackURL: configService.get('DISCORD_CALLBACK_URL') ?? '',
      scope: 'identify email',
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { id: snowflake, username: discordUsername } = profile;
    const email = profile.email || '';
    
    return this.authService.validateUser(
      snowflake,
      discordUsername,
      email,
    );
  }
} 