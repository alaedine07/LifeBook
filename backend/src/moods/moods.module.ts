import { Module } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { MoodsController } from './moods.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [MoodsController],
  providers: [MoodsService, PrismaService],
})
export class MoodsModule {}
