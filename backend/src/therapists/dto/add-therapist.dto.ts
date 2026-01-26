import { IsEmail } from 'class-validator';

export class AddTherapistDto {
  @IsEmail()
  email: string;
}
