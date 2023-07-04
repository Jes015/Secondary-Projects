import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class UpdateProductDto {

    @IsString()
    @MinLength(3)
    @IsOptional()
    title?: string

    @IsString()
    @IsPositive()
    @IsOptional()
    price?: number

    @IsString()
    @IsOptional()
    description?: string


    @IsString()
    @IsOptional()
    slug?: string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    sizes?: string[]

    @IsIn(['men', 'women', 'kid', 'unisex'])
    @IsOptional()
    gender?: string

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[]

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]

}