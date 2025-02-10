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

  async findOne(snowflake: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { snowflake },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    snowflake: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      promoSnowflake: number;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: { snowflake },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const promo = await this.promoRepository.findOne({
      where: { snowflake: data.promoSnowflake },
    });

    if (!promo) {
      throw new NotFoundException('Promo not found');
    }

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.promo = promo;

    return this.userRepository.save(user);
  }

  async validateUser(targetSnowflake: number, adminSnowflake: number) {
    const admin = await this.userRepository.findOne({
      where: { snowflake: adminSnowflake },
      relations: ['promo', 'promo.roles'],
    });

    if (!admin?.promo?.roles.some(role => role.type === 'admin')) {
      throw new ForbiddenException('Only admins can validate users');
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

    const user = await this.findOne(parseInt(targetSnowflake));
    user.status = false;
    return this.userRepository.save(user);
  }

  async deleteAccount(snowflake: number) {
    const user = await this.findOne(snowflake);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(user);
  }
} 