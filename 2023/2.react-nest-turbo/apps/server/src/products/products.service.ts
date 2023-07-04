import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductImage } from './entities'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>
  ) { }

  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails } = createProductDto

    const productCreated = this.productRepository.create({
      ...productDetails,
      images: images.map((productImage) => this.productImageRepository.create({ url: productImage }))
    })

    try {
      await this.productRepository.save(productCreated)
    } catch (error) {

      this.logger.error(error)

      if (error.code === '23505') {
        throw new HttpException(error.detail, HttpStatus.CONFLICT)
      }

    }

    return productCreated
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 5, offset = 0 } = paginationDto

    return await this.productRepository.find({
      take: limit,
      skip: offset
    })
  }

  async findOne(searchParam: string) {

    let productFound: Product

    if (isUUID(searchParam)) {
      productFound = await this.productRepository.findOneBy({ id: searchParam })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder()
      productFound = await queryBuilder
        .where('title =:title OR slug =:slug',
          {
            title: searchParam,
            slug: searchParam
          }
        ).getOne()
    }

    if (productFound == null) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }

    return productFound
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images = [], ...productDetails } = updateProductDto
    const productPreUpdated = await this.productRepository.preload({
      id: id,
      ...productDetails,
      images: images.map((productImage) => this.productImageRepository.create({ url: productImage }))
    })

    if (productPreUpdated == null) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }

    await this.productRepository.save(productPreUpdated)

    return { ...productPreUpdated, images }
  }

  async remove(searchParam: string) {

    const productDeleted = await this.productRepository.delete({ id: searchParam })

    if (productDeleted.affected === 0) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND)
    }

    return `Product deleted`
  }
}
