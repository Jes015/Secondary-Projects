import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(1)
  number: number;
}
