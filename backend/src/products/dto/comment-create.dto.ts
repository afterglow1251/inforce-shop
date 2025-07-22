import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;
}
