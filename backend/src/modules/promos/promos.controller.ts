import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PromosService } from './promos.service';
import { CreatePromoDto, UpdatePromoDto, PromoResponseDto } from '../../common/dto/promo.dto';

@Controller('promos')
@UseGuards(AuthGuard('jwt-cookie'))
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Get()
  async findAll(): Promise<PromoResponseDto[]> {
    return this.promosService.findAll();
  }

  @Get(':snowflake')
  async findOne(@Param('snowflake') snowflake: string): Promise<PromoResponseDto> {
    return this.promosService.findOne(snowflake);
  }

  @Post()
  async create(@Body() data: CreatePromoDto): Promise<PromoResponseDto> {
    return this.promosService.create(data);
  }

  @Put(':snowflake')
  async update(
    @Param('snowflake') snowflake: string,
    @Body() data: UpdatePromoDto,
  ): Promise<PromoResponseDto> {
    return this.promosService.update(snowflake, data);
  }

  @Delete(':snowflake')
  async delete(
    @Param('snowflake') snowflake: string,
  ): Promise<void> {
    await this.promosService.delete(snowflake);
  }
} 