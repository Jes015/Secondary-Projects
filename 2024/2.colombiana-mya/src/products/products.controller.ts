import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Auth } from 'src/auth/decorators/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.detocator';
import { RoleProtected } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CValidRoles } from 'src/auth/models/roles.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('Products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RoleProtected(CValidRoles.user)
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @RoleProtected(CValidRoles.user)
  findAll(@Query() queryParams: PaginationDto) {
    return this.productsService.findAll(queryParams);
  }

  @Get(':searchParam')
  @RoleProtected(CValidRoles.user)
  findOne(@Param('searchParam') searchParam: string) {
    return this.productsService.findOne(searchParam);
  }

  @Patch(':id')
  @RoleProtected(CValidRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @RoleProtected(CValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.productsService.remove(id);
  }
}
