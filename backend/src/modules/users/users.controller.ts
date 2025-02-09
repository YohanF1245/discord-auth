import { Controller, Get, Put, Body, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Req() req: any) {
    return this.usersService.findAll(req.user.sub);
  }

  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() data: {
      nom: string;
      prenom: string;
      email: string;
      promo_snowflake: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.sub, data);
  }

  @Put(':snowflake/validate')
  async validateUser(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.usersService.validateUser(snowflake, req.user.sub);
  }

  @Put(':snowflake/invalidate')
  async invalidateUser(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.usersService.invalidateUser(snowflake, req.user.sub);
  }
} 