import { IsString, IsOptional, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindManyQueryParams {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  per_page: number;

  @IsOptional()
  @IsString()
  includes: string;

  @IsOptional()
  filters: { [key: string]: string };
}
