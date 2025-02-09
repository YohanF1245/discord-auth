import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities/channel.entity';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User, Role])],
  providers: [ChannelsService],
  controllers: [ChannelsController],
  exports: [ChannelsService],
})
export class ChannelsModule {} 