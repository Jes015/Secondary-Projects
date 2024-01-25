import { Injectable } from '@nestjs/common';
import { IsNumber, IsOptional, Min } from 'class-validator';

@Injectable()
export class PaginationDTO {
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  offset: number;
}
