import { IsNumber, IsOptional, Min } from "class-validator"

export class CreatePaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number

    @IsOptional()
    @IsNumber()
    @Min(1)
    offset?: number
}