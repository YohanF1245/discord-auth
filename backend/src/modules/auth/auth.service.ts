import { Injectable } from '@nestjs/common';
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

  async validateUser(snowflake: string, discord_username: string, email: string) {
    let user = await this.userRepository.findOne({ where: { snowflake } });

    if (!user) {
      user = this.userRepository.create({
        snowflake,
        discord_username,
        email,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async login(user: any) {
    const payload = { 
      sub: user.snowflake,
      username: user.discord_username,
      status: user.status,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 