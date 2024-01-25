import { Injectable } from '@nestjs/common';
import { FetchAdapter } from 'src/common/adapter/fetch.adapter';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { ResponsePokeAPI } from './interfaces';

@Injectable()
export class SeedService {
  constructor(
    private pokemonService: PokemonService,
    private httpAdapter: FetchAdapter,
  ) {}

  async seedDB() {
    await this.pokemonService.deleteAll();

    const data = await this.httpAdapter.get<ResponsePokeAPI>(
      'https://pokeapi.co/api/v2/pokemon?limit=600',
    );

    const pokemonsToInsert: CreatePokemonDto[] = [];
    data.results.forEach(({ name, url }) => {
      const pokemonNumber = url.split('/').at(-2);

      const pokemon = {
        name,
        number: Number(pokemonNumber),
      };

      pokemonsToInsert.push(pokemon);
    });

    await this.pokemonService.insertMany(pokemonsToInsert);
    return `This action returns all seed`;
  }
}
