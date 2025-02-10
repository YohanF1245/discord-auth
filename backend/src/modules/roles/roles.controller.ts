import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '../../common/dto/role.dto';

@Controller('roles')
@UseGuards(AuthGuard('jwt-cookie'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    return this.rolesService.findAll();
  }

  @Get(':snowflake')
  async findOne(@Param('snowflake') snowflake: string): Promise<RoleResponseDto> {
    return this.rolesService.findOne(snowflake);
  }

  @Post()
  async create(@Body() data: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(data);
  }

  @Put(':snowflake')
  async update(
    @Param('snowflake') snowflake: string,
    @Body() data: UpdateRoleDto,
    @Req() req: any,
  ): Promise<RoleResponseDto> {
    return this.rolesService.update(snowflake, data, req.user.sub);
  }

  @Delete(':snowflake')
  async delete(
    @Param('snowflake') snowflake: string,
    @Req() req: any,
  ): Promise<void> {
    await this.rolesService.delete(snowflake, req.user.sub);
  }
} 