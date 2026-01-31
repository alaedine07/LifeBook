import { IsOptional, IsEnum, IsString } from 'class-validator';
import { MoodType } from '@prisma/client';

export class UpdateMoodDto {
  @IsOptional() @IsEnum(MoodType)
  moodType?: MoodType;

  @IsOptional() @IsString()
  note?: string;
}
