import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Pokemon } from '../pokemons/entities/pokemon.entity'
import { PokeResponse } from './modles'

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async generateSeed() {

    await this.pokemonModel.deleteMany({})

    const { results }: PokeResponse = await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=25')).json()

    const adaptedResults = results.map((pokemonData) => {

      const pokemonNumber = new URL(pokemonData.url).pathname.split('/')[4]

      const adaptedResult = { name: pokemonData.name, numero: Number(pokemonNumber) }

      return adaptedResult

    })

    return await this.pokemonModel.insertMany(adaptedResults)
  }
}