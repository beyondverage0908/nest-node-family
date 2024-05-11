import { Test, TestingModule } from '@nestjs/testing';
import { ZnxgController } from './znxg.controller';

describe('ZnxgController', () => {
  let controller: ZnxgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZnxgController],
    }).compile();

    controller = module.get<ZnxgController>(ZnxgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
