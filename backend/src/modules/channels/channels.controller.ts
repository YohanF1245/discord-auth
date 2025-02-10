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
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, UpdateChannelDto } from '../../dto/channel.dto';

@Controller('api/channels')
@UseGuards(AuthGuard('jwt'))
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.channelsService.findAll(req.user.sub);
  }

  @Get(':snowflake')
  async findOne(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.channelsService.findOne(snowflake, req.user.sub);
  }

  @Post()
  async create(@Body() data: CreateChannelDto) {
    return this.channelsService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateChannelDto,
  ) {
    return this.channelsService.update(id, data);
  }

  @Delete(':snowflake')
  async delete(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.channelsService.delete(snowflake, req.user.sub);
  }
} 