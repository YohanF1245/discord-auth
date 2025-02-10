import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Promo } from '../../entities/promo.entity';
import { CreateChannelDto, UpdateChannelDto } from '../../dto/channel.dto';

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

  async findAll(userSnowflake: string) {
    const user = await this.userRepository.findOne({
      where: { snowflake: Number(userSnowflake) },
      relations: ['promo', 'promo.roles'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Si l'utilisateur est admin, retourne tous les channels
    if (user.promo?.roles.some(role => role.type === 'admin')) {
      return this.channelRepository.find({
        relations: ['promos'],
      });
    }

    // Sinon, retourne uniquement les channels publics et ceux de sa promo
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.promos', 'promo')
      .where('channel.is_public = :isPublic', { isPublic: true })
      .orWhere('promo.snowflake = :promoSnowflake', {
        promoSnowflake: user.promo?.snowflake,
      })
      .getMany();
  }

  async findOne(snowflake: string, userSnowflake: string) {
    const user = await this.userRepository.findOne({
      where: { snowflake: Number(userSnowflake) },
      relations: ['promo', 'promo.roles'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const channel = await this.channelRepository.findOne({
      where: { snowflake },
      relations: ['promos'],
    });

    if (!channel) {
      throw new NotFoundException('Channel non trouvé');
    }

    // Vérifie si l'utilisateur a accès au channel
    const hasAccess =
      channel.is_public ||
      user.promo?.roles.some(role => role.type === 'admin') ||
      channel.promos.some(promo => promo.snowflake === user.promo?.snowflake);

    if (!hasAccess) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce channel');
    }

    return channel;
  }

  async create(data: CreateChannelDto): Promise<Channel> {
    const channel = new Channel();
    channel.promos = await this.promoRepository.findByIds(data.promos_snowflakes);
    return this.channelRepository.save(channel);
  }

  async update(id: number, data: UpdateChannelDto): Promise<Channel> {
    const channel = await this.channelRepository.findOne({ where: { id } });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    
    if (data.promos_snowflakes) {
      channel.promos = await this.promoRepository.findByIds(data.promos_snowflakes);
    }
    
    return this.channelRepository.save(channel);
  }

  async delete(snowflake: string, userSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: Number(userSnowflake) })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Seuls les administrateurs peuvent supprimer des channels');
    }

    const channel = await this.findOne(snowflake, userSnowflake);
    await this.channelRepository.remove(channel);
  }
} 