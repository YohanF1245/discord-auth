import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Promo } from '../../entities/promo.entity';
import { CreateChannelDto, UpdateChannelDto } from '../../common/dto/channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
  ) {}

  async findAll() {
    return this.channelRepository.find({
      relations: ['promos'],
    });
  }

  async findOne(snowflake: string) {
    const channel = await this.channelRepository.findOne({
      where: { snowflake },
      relations: ['promos'],
    });

    if (!channel) {
      throw new NotFoundException('Channel non trouvé');
    }

    return channel;
  }

  async create(data: CreateChannelDto): Promise<Channel> {
    const channel = new Channel();
    channel.snowflake = data.snowflake;
    channel.name = data.name;
    channel.is_public = data.is_public;
    channel.promos = await this.promoRepository.findByIds(data.promos_snowflakes);
    return this.channelRepository.save(channel);
  }

  async update(snowflake: string, data: UpdateChannelDto): Promise<Channel> {
    const channel = await this.channelRepository.findOne({ where: { snowflake } });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    
    channel.name = data.name;
    channel.is_public = data.is_public;
    
    if (data.promos_snowflakes) {
      channel.promos = await this.promoRepository.findByIds(data.promos_snowflakes);
    }
    
    return this.channelRepository.save(channel);
  }

  async delete(snowflake: string) {
    const channel = await this.findOne(snowflake);
    await this.channelRepository.remove(channel);
  }
} 