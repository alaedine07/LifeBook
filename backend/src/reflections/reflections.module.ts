import { Module } from '@nestjs/common';
import { ReflectionsService } from './reflections.service';
import { ReflectionsController } from './reflections.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ReflectionsController],
  providers: [ReflectionsService, PrismaService],
})
export class ReflectionsModule {}
