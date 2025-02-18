import { Test, TestingModule } from '@nestjs/testing';
import { EmergenciesService } from './emergencies.service';

describe('EmergenciesService', () => {
  let service: EmergenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmergenciesService],
    }).compile();

    service = module.get<EmergenciesService>(EmergenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
