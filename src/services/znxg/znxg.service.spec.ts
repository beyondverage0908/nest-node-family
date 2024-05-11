import { Test, TestingModule } from '@nestjs/testing';
import { ZnxgService } from './znxg.service';

describe('ZnxgService', () => {
  let service: ZnxgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZnxgService],
    }).compile();

    service = module.get<ZnxgService>(ZnxgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
