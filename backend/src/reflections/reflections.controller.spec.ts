import { Test, TestingModule } from '@nestjs/testing';
import { ReflectionController } from './reflections.controller';

describe('ReflectionsController', () => {
  let controller: ReflectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReflectionController],
    }).compile();

    controller = module.get<ReflectionController>(ReflectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
