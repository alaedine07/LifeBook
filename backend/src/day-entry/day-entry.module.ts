import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayEntry } from './entities/day-entry.entity';
import { DayEntryService } from './day-entry.service';
import { DayEntryController } from './day-entry.controller';
import { ReflectionModule } from 'src/reflections/reflections.module';

@Module({
  imports: [TypeOrmModule.forFeature([DayEntry]), ReflectionModule],
  providers: [DayEntryService],
  controllers: [DayEntryController],
})
export class DayEntryModule {}
