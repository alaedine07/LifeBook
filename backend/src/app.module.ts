import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReflectionsModule } from './reflections/reflections.module';
import { MoodsModule } from './moods/moods.module';
import { TherapistsModule } from './therapists/therapists.module';
import { DailyAnswersModule } from './daily-answers/daily-answers.module';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),AuthModule, UsersModule, ReflectionsModule, MoodsModule, TherapistsModule, DailyAnswersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
