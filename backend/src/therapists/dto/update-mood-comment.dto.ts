import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMoodCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string | undefined;
}
