import { Controller, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

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
  async discordAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.login(req.user);
      
      // Set the JWT in an HttpOnly cookie
      res.cookie('jwt', access_token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
      });

      res.redirect('http://localhost:5173/profile');
    } catch (error) {
      console.error('Error in discordAuthRedirect:', error);
      res.redirect('http://localhost:5173/?error=auth_failed');
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.redirect('http://localhost:5173/');
  }

  @Get('check')
  @UseGuards(AuthGuard('jwt-cookie'))
  async checkAuth(@Req() req) {
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