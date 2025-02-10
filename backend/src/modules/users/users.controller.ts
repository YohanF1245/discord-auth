import { Controller, Get, Put, Body, UseGuards, Req, Param, Patch, ParseIntPipe, Delete } from '@nestjs/common';
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

  @Delete('me')
  async deleteAccount(@Req() req: any) {
    return this.usersService.deleteAccount(req.user.sub);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt-cookie'))
  async updateProfile(@Req() req, @Body() data: {
    firstName: string;
    lastName: string;
    email: string;
    promoSnowflake: number;
  }) {
    return this.usersService.updateProfile(req.user.sub, data);
  }

  @Patch('validate/:snowflake')
  @UseGuards(AuthGuard('jwt-cookie'))
  async validateUser(@Param('snowflake', ParseIntPipe) snowflake: number, @Req() req) {
    return this.usersService.validateUser(snowflake, req.user.sub);
  }

  @Put(':snowflake/invalidate')
  async invalidateUser(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.usersService.invalidateUser(snowflake, req.user.sub);
  }

  @Get(':snowflake')
  async getUser(@Param('snowflake', ParseIntPipe) snowflake: number) {
    return this.usersService.findOne(snowflake);
  }
} 