import { Test, TestingModule } from '@nestjs/testing';
import { CasbinService } from './casbin.service';

describe('CasbinService', () => {
  let service: CasbinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasbinService],
    }).compile();

    service = module.get<CasbinService>(CasbinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
