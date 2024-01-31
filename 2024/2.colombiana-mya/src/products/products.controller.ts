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
import { UUID } from 'crypto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() queryParams: PaginationDto) {
    return this.productsService.findAll(queryParams);
  }

  @Get(':searchParam')
  findOne(@Param('searchParam') searchParam: string) {
    return this.productsService.findOne(searchParam);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.productsService.remove(id);
  }
}
