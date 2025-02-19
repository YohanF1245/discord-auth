import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Promotion } from '../promotions/promotion.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('test-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate and return a JWT token for existing user', async () => {
    const promotion = { id: 1, name: 'Promo2024', snowflake: '123456789', users: [] };
    const user: User = { 
      id: 1, 
      snowflake: '123456789', 
      discordUsername: 'TestUser', 
      nom: 'Nom', 
      prenom: 'Prenom', 
      email: 'test@example.com', 
      status: true,
      promotion,
    };
    (usersService.findOne as jest.Mock).mockResolvedValue(user);

    const result = await service.validateUser('123456789');
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.snowflake });
    expect(result).toBe('test-jwt-token');
  });

  it('should throw UnauthorizedException for non-existing user', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.validateUser('987654321')).rejects.toThrow(UnauthorizedException);
  });
}); 