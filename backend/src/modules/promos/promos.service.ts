import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promo } from '../../entities/promo.entity';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { Channel } from '../../entities/channel.entity';
import { CreatePromoDto } from '../../common/dto/promo.dto';

@Injectable()
export class PromosService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async findAll() {
    return this.promoRepository.find({
      relations: ['roles', 'channels'],
    });
  }

  async findOne(snowflake: string) {
    const promo = await this.promoRepository.findOne({
      where: { snowflake: Number(snowflake) },
      relations: ['roles', 'channels', 'users'],
    });

    if (!promo) {
      throw new NotFoundException('Promotion non trouvée');
    }

    return promo;
  }

  async create(data: CreatePromoDto): Promise<Promo> {
    const promo = new Promo();
    const channels = await this.channelRepository.findByIds(data.channels_snowflakes);
    const roles = await this.roleRepository.findByIds(data.roles_snowflakes);
    
    promo.snowflake = data.snowflake;
    promo.name = data.name;
    promo.channels = channels;
    promo.roles = roles;
    
    return this.promoRepository.save(promo);
  }

  async update(
    snowflake: string,
    data: {
      name: string;
      roles_snowflakes: string[];
      channels_snowflakes: string[];
    },
  ) {
    const promo = await this.findOne(snowflake);
    const roles = await this.roleRepository.findByIds(data.roles_snowflakes);
    const channels = await this.channelRepository.findByIds(data.channels_snowflakes);

    promo.name = data.name;
    promo.roles = roles;
    promo.channels = channels;

    return this.promoRepository.save(promo);
  }

  async delete(snowflake: string) {
    const promo = await this.findOne(snowflake);
    await this.promoRepository.remove(promo);
  }
} 