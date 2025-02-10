import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto, UserResponseDto } from '../../common/dto/user.dto';
import { CreateUserDto } from '../../common/dto/user.dto';
import { UpdateUserDto } from '../../common/dto/user.dto';
import { Request } from 'express';

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
  findMe(@Req() req: Request) {
    return this.usersService.findOne(req.user.snowflake);
  }

  @Get(':snowflake')
  @UseGuards(AuthGuard('jwt-cookie'))
  findOne(@Param('snowflake') snowflake: string) {
    return this.usersService.findOne(snowflake);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt-cookie'))
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.snowflake, updateUserDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt-cookie'))
  remove(@Req() req: Request) {
    return this.usersService.remove(req.user.snowflake);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() data: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(req.user.sub, data);
  }

  @Put(':snowflake/validate')
  async validateUser(
    @Param('snowflake', ParseIntPipe) snowflake: number,
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