import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId } from 'mongoose'
import { CreatePaginationDto } from 'src/common/dtos/pagination.dto'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Pokemon } from './entities/pokemon.entity'

@Injectable()
export class PokemonsService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {

      if (error.code === 11000) {
        throw new HttpException('Some pokemon value already exists', HttpStatus.CONFLICT)
      }

      console.log(error)
      throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findAll(pagitationDto: CreatePaginationDto) {

    return this.pokemonModel.find().limit(pagitationDto?.limit).skip(pagitationDto?.offset)
  }

  async findOne(searchParam: string) {
    let pokemon: Pokemon

    if (!isNaN(Number(searchParam))) {
      pokemon = await this.pokemonModel.findOne({ numero: searchParam })
    }
    else if (isValidObjectId(searchParam)) {
      pokemon = await this.pokemonModel.findById(searchParam)
    }
    else if (typeof searchParam == 'string') {
      pokemon = await this.pokemonModel.findOne({ name: searchParam })
    }
    else {
      throw new BadRequestException('Bad Request')
    }

    if (pokemon == null) throw new NotFoundException('Pokemon not found')

    return pokemon
  }

  async update(searchParam: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(searchParam)
    if (updatePokemonDto.name != null) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
    }

    try {
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto, { new: true })
      return { ...pokemon, ...updatedPokemon }
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Some pokemon value already exists', HttpStatus.CONFLICT)
      }

      console.log(error)
      throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
    }


  }

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })

    if (deletedCount === 0) throw new NotFoundException('Id not found')

    return 'Ok'
  }
}
