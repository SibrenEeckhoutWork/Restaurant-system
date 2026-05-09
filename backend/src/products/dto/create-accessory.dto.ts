import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}
