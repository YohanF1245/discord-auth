import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Promo } from '../../entities/promo.entity';
import { Role } from '../../entities/role.entity';
import { UpdateProfileDto, CreateUserDto, UpdateUserDto, UserResponseDto } from '../../common/dto/user.dto';

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
      relations: ['promo', 'roles'],
    });
  }

  async findOne(snowflake: string) {
    const user = await this.userRepository.findOne({
      where: { snowflake: Number(snowflake) },
      relations: ['promo', 'roles'],
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
    console.log('Updating profile for user:', snowflake);
    console.log('Update data:', data);

    const user = await this.userRepository.findOne({
      where: { snowflake },
      relations: ['roles', 'promo'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;

    if (data.promoSnowflake) {
      console.log('Looking for promo with snowflake:', data.promoSnowflake);
      const promo = await this.promoRepository.findOne({
        where: { snowflake: Number(data.promoSnowflake) },
      });

      console.log('Found promo:', promo);

      if (!promo) {
        throw new NotFoundException('Promo not found');
      }

      user.promo = promo;
    } else {
      user.promo = undefined;
    }

    const savedUser = await this.userRepository.save(user);
    console.log('Saved user:', savedUser);
    return savedUser;
  }

  async validateUser(snowflake: string): Promise<User> {
    const user = await this.findOne(snowflake);
    user.status = true;
    return this.userRepository.save(user);
  }

  async invalidateUser(snowflake: string): Promise<User> {
    const user = await this.findOne(snowflake);
    user.status = false;
    return this.userRepository.save(user);
  }
} 