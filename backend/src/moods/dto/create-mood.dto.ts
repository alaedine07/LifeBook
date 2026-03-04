import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MoodType } from '@prisma/client';

export class CreateMoodDto {
  @IsEnum(MoodType)
  moodType: MoodType;

  @IsOptional() @IsString()
  note?: string;

  @IsString()
  date: string;
}
