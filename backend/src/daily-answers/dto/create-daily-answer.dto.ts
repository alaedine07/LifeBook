import { IsInt, IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateDailyAnswerDto {
  @IsInt()
  reflectionId: number;

  @IsOptional() @IsBoolean()
  booleanAnswer?: boolean;

  @IsOptional() @IsNumber()
  numberAnswer?: number;

  @IsOptional() @IsString()
  textAnswer?: string;

  @IsString()
  date: string;
}
