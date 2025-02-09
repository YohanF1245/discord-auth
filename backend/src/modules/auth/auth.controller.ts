import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Cette route redirige vers Discord
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(@Req() req: any, @Res() res: any) {
    const { user } = req;
    const result = await this.authService.login(user);
    
    // Redirige vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}`);
  }
} 