import { IsString, IsOptional } from 'class-validator';

export class UpdateReflectionDto {
  @IsOptional() @IsString()
  question?: string;
}
