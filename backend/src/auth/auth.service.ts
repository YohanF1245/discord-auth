import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(snowflake: string): Promise<string> {
    const user: User = await this.usersService.findOne(snowflake);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.jwtService.sign({ sub: user.snowflake });
  }
} 