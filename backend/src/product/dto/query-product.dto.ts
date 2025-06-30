import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortOptions {
  price = 'price',
  quantity = 'quantity',
}

export enum SortingOrder {
  asc = 'asc',
  desc = 'desc',
}

export class QueryProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SortOptions)
  sortBy: SortOptions;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SortingOrder)
  order: SortingOrder;
}
