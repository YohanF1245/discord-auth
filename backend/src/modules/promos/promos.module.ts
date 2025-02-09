import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from '../../entities/promo.entity';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { Channel } from '../../entities/channel.entity';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, Role, User, Channel])],
  providers: [PromosService],
  controllers: [PromosController],
  exports: [PromosService],
})
export class PromosModule {} 