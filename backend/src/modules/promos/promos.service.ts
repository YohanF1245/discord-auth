import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promo } from '../../entities/promo.entity';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class PromosService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.promoRepository.find({
      relations: ['roles', 'channels'],
    });
  }

  async findOne(snowflake: string) {
    const promo = await this.promoRepository.findOne({
      where: { snowflake },
      relations: ['roles', 'channels', 'users'],
    });

    if (!promo) {
      throw new NotFoundException('Promotion non trouvée');
    }

    return promo;
  }

  async create(data: {
    snowflake: string;
    nom: string;
    roles_snowflakes: string[];
    channels_snowflakes: string[];
  }, userSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: userSnowflake })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Seuls les administrateurs peuvent créer des promotions');
    }

    const roles = await this.roleRepository.findByIds(data.roles_snowflakes);
    const channels = await this.roleRepository.findByIds(data.channels_snowflakes);

    const promo = this.promoRepository.create({
      snowflake: data.snowflake,
      nom: data.nom,
      roles,
      channels,
    });

    return this.promoRepository.save(promo);
  }

  async update(
    snowflake: string,
    data: {
      nom: string;
      roles_snowflakes: string[];
      channels_snowflakes: string[];
    },
    userSnowflake: string,
  ) {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: userSnowflake })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Seuls les administrateurs peuvent modifier des promotions');
    }

    const promo = await this.findOne(snowflake);
    const roles = await this.roleRepository.findByIds(data.roles_snowflakes);
    const channels = await this.roleRepository.findByIds(data.channels_snowflakes);

    promo.nom = data.nom;
    promo.roles = roles;
    promo.channels = channels;

    return this.promoRepository.save(promo);
  }

  async delete(snowflake: string, userSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: userSnowflake })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Seuls les administrateurs peuvent supprimer des promotions');
    }

    const promo = await this.findOne(snowflake);
    await this.promoRepository.remove(promo);
  }
} 