import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Promo } from '../../entities/promo.entity';
import { Role } from '../../entities/role.entity';
import { UpdateProfileDto } from '../../common/dto/user.dto';
import { CreateUserDto, UpdateUserDto } from '../../common/dto/user.dto';

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

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      relations: ['promo'],
    });
  }

  async findOne(snowflake: string) {
    const user = await this.userRepository.findOne({
      where: { snowflake },
      relations: ['promo'],
    });

    if (!user) {
      throw new NotFoundException(`User with snowflake ${snowflake} not found`);
    }

    return user;
  }

  async update(snowflake: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(snowflake);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(snowflake: string) {
    const user = await this.findOne(snowflake);
    await this.userRepository.remove(user);
    return { message: 'Compte supprimé avec succès' };
  }

  async updateProfile(
    snowflake: number,
    data: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { snowflake },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let promo: Promo | null = null;
    if (data.promoSnowflake) {
      promo = await this.promoRepository.findOne({
        where: { snowflake: data.promoSnowflake },
      });

      if (!promo) {
        throw new NotFoundException('Promo not found');
      }
    }

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.promo = promo || undefined;

    return this.userRepository.save(user);
  }

  async validateUser(snowflake: string) {
    const user = await this.findOne(snowflake);
    user.status = true;
    return this.userRepository.save(user);
  }

  async invalidateUser(snowflake: string) {
    const user = await this.findOne(snowflake);
    user.status = false;
    return this.userRepository.save(user);
  }
} 