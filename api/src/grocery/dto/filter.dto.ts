import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { GroceryItemStatus } from '@prisma/client'

export class FilterGroceryDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  priority?: number

  @IsEnum(GroceryItemStatus)
  @IsOptional()
  status?: GroceryItemStatus

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(5)
  @IsOptional()
  page?: number

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  pageSize?: number
}
