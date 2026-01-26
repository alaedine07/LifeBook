import { IsString, IsEnum } from 'class-validator';
import { ReflectionType } from '@prisma/client';

export class CreateReflectionDto {
  @IsString()
  question: string;

  @IsEnum(ReflectionType)
  type: ReflectionType;
}
