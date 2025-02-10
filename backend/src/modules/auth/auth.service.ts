import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(snowflake: string, discordUsername: string, email: string): Promise<User> {
    try {
      console.log('Validating user:', { snowflake, discordUsername, email });
      
      let user = await this.userRepository.findOne({ 
        where: { snowflake: Number(snowflake) },
        relations: ['roles', 'promo'],
      });
      console.log('Found user:', user);
      
      if (!user) {
        console.log('Creating new user');
        const newUser = this.userRepository.create({
          snowflake: Number(snowflake),
          discordUsername,
          email,
          status: false,
          roles: [],
        });
        user = await this.userRepository.save(newUser);
        console.log('User created successfully:', user);
      }

      return user;
    } catch (error) {
      console.error('Error in validateUser:', error);
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  async login(user: User) {
    const payload = { 
      sub: user.snowflake,
      username: user.discordUsername,
      status: user.status,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getUser(snowflake: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { snowflake },
      relations: ['roles', 'promo'],
    });
  }
} 