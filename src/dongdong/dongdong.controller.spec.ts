import { Test, TestingModule } from '@nestjs/testing';
import { DongdongController } from './dongdong.controller';

describe('DongdongController', () => {
  let controller: DongdongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DongdongController],
    }).compile();

    controller = module.get<DongdongController>(DongdongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
