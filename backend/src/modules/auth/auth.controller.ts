import { Controller, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from '../../common/dto/auth.dto';
import { UserResponseDto } from '../../common/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Initiates the Discord OAuth2 login flow
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(@Req() req, @Res() res: Response): Promise<void> {
    try {
      const { access_token } = await this.authService.login(req.user);
      const frontendUrl = this.configService.get('FRONTEND_URL') ?? 'http://localhost:5173';
      
      res.cookie('jwt', access_token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
        domain: 'localhost',
      });

      res.cookie('isAuthenticated', 'true', {
        httpOnly: false,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
        domain: 'localhost',
      });

      res.redirect(frontendUrl + '/profile');
    } catch (error) {
      console.error('Error in discordAuthRedirect:', error);
      const frontendUrl = this.configService.get('FRONTEND_URL') ?? 'http://localhost:5173';
      res.redirect(frontendUrl + '/?error=auth_failed');
    }
  }

  @Get('logout')
  async logout(@Res() res: Response): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL') ?? 'http://localhost:5173';
    
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      domain: 'localhost',
    });
    res.clearCookie('isAuthenticated', {
      httpOnly: false,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      domain: 'localhost',
    });
    res.redirect(frontendUrl);
  }

  @Get('check')
  @UseGuards(AuthGuard('jwt-cookie'))
  async checkAuth(@Req() req): Promise<UserResponseDto> {
    const user = await this.authService.getUser(req.user.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      snowflake: user.snowflake,
      discordUsername: user.discordUsername,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      roles: user.roles,
      promo: user.promo,
    };
  }
} 