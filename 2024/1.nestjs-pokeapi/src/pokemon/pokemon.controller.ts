import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.pokemonService.findAll(paginationDTO);
  }

  @Get(':pokemonTerm')
  findOne(@Param('pokemonTerm') pokemonTerm: string) {
    return this.pokemonService.findOne(pokemonTerm);
  }

  @Patch(':pokemonTerm')
  update(
    @Param('pokemonTerm') pokemonTerm: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(pokemonTerm, updatePokemonDto);
  }

  @Delete(':pokemonTerm')
  remove(@Param('pokemonTerm', ParseMongoIdPipe) pokemonTerm: string) {
    return this.pokemonService.remove(pokemonTerm);
  }
}
