import { IsNotEmpty, IsString } from 'class-validator';

export class AddMoodCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string | undefined;
}
