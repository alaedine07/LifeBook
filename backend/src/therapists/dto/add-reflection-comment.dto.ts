import { IsNotEmpty, IsString } from 'class-validator';

export class AddReflectionCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
