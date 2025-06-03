import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflection } from './entities/reflection.entity';
import { ReflectionService } from './reflections.service';
import { ReflectionController } from './reflections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reflection])],
  providers: [ReflectionService],
  controllers: [ReflectionController],
  exports: [ReflectionService],
})
export class ReflectionModule {}
