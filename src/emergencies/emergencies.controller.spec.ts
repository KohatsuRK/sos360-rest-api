import { Test, TestingModule } from '@nestjs/testing';
import { EmergenciesController } from './emergencies.controller';

describe('EmergenciesController', () => {
  let controller: EmergenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergenciesController],
    }).compile();

    controller = module.get<EmergenciesController>(EmergenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
