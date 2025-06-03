import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflection } from './reflections/entities/reflection.entity';
import { DayEntry } from './day-entry/entities/day-entry.entity';
import { ReflectionModule } from './reflections/reflections.module';
import { DayEntryModule } from './day-entry/day-entry.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // Database type
      database: 'db.sqlite', // File name for SQLite
      entities: [Reflection, DayEntry], // Add all your entities
      synchronize: true, // Auto-create tables (perfect for development)
      logging: true, // Show SQL queries in console (helpful for debugging)
    }),
    ReflectionModule,
    DayEntryModule,
  ],
})
export class AppModule {}
