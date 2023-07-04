import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Pokemon, PokemonSchema } from './entities/pokemon.entity'
import { PokemonsController } from './pokemons.controller'
import { PokemonsService } from './pokemons.service'

@Module({
  controllers: [PokemonsController],
  providers: [PokemonsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class PokemonsModule { }
