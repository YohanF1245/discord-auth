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
import { PromosService } from './promos.service';
import { CreatePromoDto } from '../../dto/create-promo.dto';

@Controller('api/promos')
@UseGuards(AuthGuard('jwt'))
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Get()
  async findAll() {
    return this.promosService.findAll();
  }

  @Get(':snowflake')
  async findOne(@Param('snowflake') snowflake: string) {
    return this.promosService.findOne(snowflake);
  }

  @Post()
  async create(@Body() data: CreatePromoDto) {
    return this.promosService.create(data);
  }

  @Put(':snowflake')
  async update(
    @Param('snowflake') snowflake: string,
    @Body() data: {
      name: string;
      roles_snowflakes: string[];
      channels_snowflakes: string[];
    },
    @Req() req: any,
  ) {
    return this.promosService.update(snowflake, data, req.user.sub);
  }

  @Delete(':snowflake')
  async delete(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.promosService.delete(snowflake, req.user.sub);
  }
} 