import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemAccessoryDto {
  @IsUUID()
  accessoryId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemAccessoryDto)
  accessories?: OrderItemAccessoryDto[];
}
