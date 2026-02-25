import { Module } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { TherapistsController } from './therapists.controller';
import { ReflectionCommentsController } from './reflection-comments.controller';
import { PrismaService } from 'prisma/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TherapistsController, ReflectionCommentsController],
  providers: [TherapistsService, PrismaService],
})
export class TherapistsModule {}
