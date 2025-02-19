import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptionsWithRequest } from 'passport-discord';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly logger = new Logger(DiscordStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const clientID = configService.get('DISCORD_CLIENT_ID');
    const clientSecret = configService.get('DISCORD_CLIENT_SECRET');
    const callbackURL = configService.get('DISCORD_CALLBACK_URL');

    // Debug logs
    console.log('Discord OAuth Configuration:');
    console.log('Client ID:', clientID);
    console.log('Client Secret:', clientSecret ? '***' + clientSecret.slice(-4) : 'Not set');
    console.log('Callback URL:', callbackURL);

    const options: StrategyOptionsWithRequest = {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['identify', 'email'],
      passReqToCallback: true,
    };

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Discord OAuth configuration');
    }

    super(options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    this.logger.debug(`Validating Discord user: ${profile.username}`);
    const { id: snowflake, username: discordUsername } = profile;
    const email = profile.email || '';
    
    return this.authService.validateUser(
      snowflake,
      discordUsername,
      email,
    );
  }
} 