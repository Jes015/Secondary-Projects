import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { PokemonsService } from './pokemons.service'
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe'
import { CreatePaginationDto } from 'src/common/dtos/pagination.dto'

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) { }

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonsService.create(createPokemonDto)
  }

  @Get()
  findAll(@Query() pagitationDto: CreatePaginationDto ) {
    return this.pokemonsService.findAll(pagitationDto)
  }

  @Get(':searchParam')
  findOne(@Param('searchParam') searchParam: string) {
    return this.pokemonsService.findOne(searchParam)
  }

  @Patch(':searchParam')
  update(@Param('searchParam') searchParam: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonsService.update(searchParam, updatePokemonDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonsService.remove(id)
  }
}
