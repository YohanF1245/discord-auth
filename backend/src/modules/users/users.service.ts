import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Promo } from '../../entities/promo.entity';
import { Role } from '../../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(userSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: userSnowflake })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!admin) {
      throw new ForbiddenException('Seuls les administrateurs peuvent voir la liste des utilisateurs');
    }

    return this.userRepository.find({
      relations: ['promo', 'promo.roles'],
    });
  }

  async findOne(snowflake: string) {
    const user = await this.userRepository.findOne({
      where: { snowflake },
      relations: ['promo', 'promo.roles'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async updateProfile(
    snowflake: string,
    data: {
      nom: string;
      prenom: string;
      email: string;
      promo_snowflake: string;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: { snowflake },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const promo = await this.promoRepository.findOne({
      where: { snowflake: data.promo_snowflake },
    });

    if (!promo) {
      throw new NotFoundException('Promotion non trouvée');
    }

    user.nom = data.nom;
    user.prenom = data.prenom;
    user.email = data.email;
    user.promo = promo;

    return this.userRepository.save(user);
  }

  async validateUser(targetSnowflake: string, adminSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: adminSnowflake })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!admin) {
      throw new ForbiddenException('Seuls les administrateurs peuvent valider les utilisateurs');
    }

    const user = await this.findOne(targetSnowflake);
    user.status = true;
    return this.userRepository.save(user);
  }

  async invalidateUser(targetSnowflake: string, adminSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: adminSnowflake })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!admin) {
      throw new ForbiddenException('Seuls les administrateurs peuvent invalider les utilisateurs');
    }

    const user = await this.findOne(targetSnowflake);
    user.status = false;
    return this.userRepository.save(user);
  }
} 