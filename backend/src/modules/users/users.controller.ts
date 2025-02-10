import { Controller, Get, Post, Put, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto, UserResponseDto, CreateUserDto, UpdateUserDto } from '../../common/dto/user.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    username: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt-cookie'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt-cookie'))
  findMe(@Req() req: RequestWithUser) {
    return this.usersService.findOne(String(req.user.sub));
  }

  @Get(':snowflake')
  @UseGuards(AuthGuard('jwt-cookie'))
  findOne(@Param('snowflake') snowflake: string) {
    return this.usersService.findOne(snowflake);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt-cookie'))
  update(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(String(req.user.sub), updateUserDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt-cookie'))
  remove(@Req() req: RequestWithUser) {
    return this.usersService.remove(String(req.user.sub));
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt-cookie'))
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() data: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(req.user.sub, data);
  }

  @Put(':snowflake/validate')
  async validateUser(
    @Param('snowflake') snowflake: string,
  ): Promise<UserResponseDto> {
    return this.usersService.validateUser(snowflake);
  }

  @Put(':snowflake/invalidate')
  async invalidateUser(
    @Param('snowflake') snowflake: string,
  ): Promise<UserResponseDto> {
    return this.usersService.invalidateUser(snowflake);
  }
} 