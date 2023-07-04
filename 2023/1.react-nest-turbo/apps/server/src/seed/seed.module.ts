import { Module } from '@nestjs/common'
import { PokemonsModule } from '../pokemons/pokemons.module'
import { SeedController } from './seed.controller'
import { SeedService } from './seed.service'

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PokemonsModule]
})
export class SeedModule { }
