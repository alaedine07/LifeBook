import { IsInt, IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateDailyAnswerDto {
  @IsOptional() @IsBoolean()
  booleanAnswer?: boolean;

  @IsOptional() @IsNumber()
  numberAnswer?: number;

  @IsOptional() @IsString()
  textAnswer?: string;
}
