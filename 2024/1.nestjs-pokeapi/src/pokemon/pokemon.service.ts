import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<Pokemon>,
    private configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('pokemonLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase().trim();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDTO: PaginationDTO) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDTO;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        number: 1,
      })
      .select('-__v');
  }

  async findOne(pokemonTerm: string) {
    pokemonTerm = pokemonTerm.trim();

    let pokemonFound: Pokemon | null = null;

    if (!isNaN(Number(pokemonTerm))) {
      pokemonFound = await this.pokemonModel.findOne({
        number: pokemonTerm,
      });
    } else if (isValidObjectId(pokemonTerm)) {
      pokemonFound = await this.pokemonModel.findById(pokemonTerm);
    } else {
      pokemonFound = await this.pokemonModel.findOne({
        name: pokemonTerm.toLowerCase(),
      });
    }

    if (pokemonFound == null)
      throw new NotFoundException(
        `Pokemon with id, name or number ${pokemonTerm} not found`,
      );

    return pokemonFound;
  }

  async update(pokemonTerm: string, updatePokemonDto: UpdatePokemonDto) {
    if (Object.values(updatePokemonDto).every((value) => value == null)) {
      throw new BadRequestException('All the values are null');
    }

    if (updatePokemonDto.name != null) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    const pokemon = await this.findOne(pokemonTerm);

    try {
      await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(pokemonMongoId: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: pokemonMongoId,
    });

    if (deletedCount === 0) {
      throw new NotFoundException(
        `This mongo id "${pokemonMongoId}" does not correspond to any pokemon.`,
      );
    }
    return `The pokemon has been deleted`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new ConflictException('Pokemon name or number already exists');
    }
    console.error(error);
    throw new InternalServerErrorException();
  }

  public async deleteAll() {
    await this.pokemonModel.deleteMany({});
  }

  public async insertMany(pokemons: CreatePokemonDto[]) {
    await this.pokemonModel.insertMany(pokemons);
  }
}
