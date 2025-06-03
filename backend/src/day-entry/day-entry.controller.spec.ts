import { Test, TestingModule } from '@nestjs/testing';
import { DayEntryController } from './day-entry.controller';

describe('DayEntryController', () => {
  let controller: DayEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayEntryController],
    }).compile();

    controller = module.get<DayEntryController>(DayEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
