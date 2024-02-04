import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.guard';
import { CValidRoles } from 'src/auth/models/roles.model';
import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('Seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Get()
  @Auth(CValidRoles.admin)
  populateDB() {
    return this.seedService.populateDB();
  }
}
