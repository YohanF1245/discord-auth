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
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto, ChannelResponseDto } from '../../common/dto/channel.dto';

@Controller('channels')
@UseGuards(AuthGuard('jwt-cookie'))
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async findAll(): Promise<ChannelResponseDto[]> {
    return this.channelsService.findAll();
  }

  @Get(':snowflake')
  async findOne(
    @Param('snowflake') snowflake: string,
  ): Promise<ChannelResponseDto> {
    return this.channelsService.findOne(snowflake);
  }

  @Post()
  async create(@Body() data: CreateChannelDto): Promise<ChannelResponseDto> {
    return this.channelsService.create(data);
  }

  @Put(':snowflake')
  async update(
    @Param('snowflake') snowflake: string,
    @Body() data: UpdateChannelDto,
  ): Promise<ChannelResponseDto> {
    return this.channelsService.update(snowflake, data);
  }

  @Delete(':snowflake')
  async delete(
    @Param('snowflake') snowflake: string,
  ): Promise<void> {
    await this.channelsService.delete(snowflake);
  }
} 