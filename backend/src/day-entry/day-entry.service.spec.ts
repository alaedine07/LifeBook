import { Test, TestingModule } from '@nestjs/testing';
import { DayEntryService } from './day-entry.service';

describe('DayEntryService', () => {
  let service: DayEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayEntryService],
    }).compile();

    service = module.get<DayEntryService>(DayEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
