import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let repo: Partial<Repository<Promotion>>;

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: getRepositoryToken(Promotion), useValue: repo },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
  });

  it('should create a new promotion', async () => {
    const dto: CreatePromotionDto = { name: 'Promo2024', snowflake: '123456789' };
    const promotion = { id: 1, ...dto };
    
    (repo.create as jest.Mock).mockReturnValue(promotion);
    (repo.save as jest.Mock).mockResolvedValue(promotion);

    expect(await service.create(dto)).toEqual(promotion);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(promotion);
  });

  it('should find all promotions', async () => {
    const promotions = [
      { id: 1, name: 'Promo2024', snowflake: '123456789' },
      { id: 2, name: 'Promo2025', snowflake: '987654321' },
    ];
    (repo.find as jest.Mock).mockResolvedValue(promotions);

    expect(await service.findAll()).toEqual(promotions);
    expect(repo.find).toHaveBeenCalled();
  });
}); 