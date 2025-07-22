import { IsString, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SizeDto {
  @IsNumber()
  @IsPositive()
  width: number;

  @IsNumber()
  @IsPositive()
  height: number;
}

export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  count: number;

  @ValidateNested()
  @Type(() => SizeDto)
  size: SizeDto;

  @IsString()
  @IsNotEmpty()
  weight: string;
}
