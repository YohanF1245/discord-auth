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
import { ChannelsService } from './channels.service';

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
  async create(
    @Body() data: {
      snowflake: string;
      nom: string;
      is_public: boolean;
      promos_snowflakes: string[];
    },
    @Req() req: any,
  ) {
    return this.channelsService.create(data, req.user.sub);
  }

  @Put(':snowflake')
  async update(
    @Param('snowflake') snowflake: string,
    @Body() data: {
      nom: string;
      is_public: boolean;
      promos_snowflakes: string[];
    },
    @Req() req: any,
  ) {
    return this.channelsService.update(snowflake, data, req.user.sub);
  }

  @Delete(':snowflake')
  async delete(@Param('snowflake') snowflake: string, @Req() req: any) {
    return this.channelsService.delete(snowflake, req.user.sub);
  }
} 