import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReflectionCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string | undefined;
}
