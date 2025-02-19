import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Promotion } from '../promotions/promotion.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Partial<Repository<User>>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create and save a new user', async () => {
    const dto: CreateUserDto = {
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      promotion: 'Promo2024',
    };
    const promotion = { id: 1, name: 'Promo2024', snowflake: '123456789', users: [] };
    const user: User = { id: 1, ...dto, status: false, promotion };
    (repo.save as jest.Mock).mockResolvedValue(user);

    expect(await service.create(dto)).toEqual(user);
    expect(repo.save).toHaveBeenCalledWith({ ...dto, promotion });
  });

  it('should find all users', async () => {
    const promotion = { id: 1, name: 'Promo2024', snowflake: '123456789', users: [] };
    const users = [
      { id: 1, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com', status: false, promotion },
      { id: 2, nom: 'Smith', prenom: 'Anna', email: 'anna.smith@example.com', status: false, promotion },
    ];
    (repo.find as jest.Mock).mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should validate recensement by setting status to true', async () => {
    const promotion = { id: 1, name: 'Promo2024', snowflake: '123456789', users: [] };
    const user: User = { id: 1, nom: 'Doe', prenom: 'John', email: 'john.doe@example.com', status: false, promotion };
    const updatedUser: User = { ...user, status: true };
    (repo.findOne as jest.Mock).mockResolvedValue(user);
    (repo.save as jest.Mock).mockResolvedValue(updatedUser);

    expect(await service.validateRecensement(1)).toEqual(updatedUser);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repo.save).toHaveBeenCalledWith({ ...user, status: true });
  });
}); 