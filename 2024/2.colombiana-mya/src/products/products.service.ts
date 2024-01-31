import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validateUUIDV4 } from 'src/common/utils/uuid.util';
import { SeedProduct } from 'src/seed/data';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private logger: Logger;
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImage: Repository<ProductImage>,
    private dataSource: DataSource,
  ) {
    this.logger = new Logger('ProductsService');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const newProduct = this.productRepository.create({
        ...productDetails,
        images: images.map((imageURL) =>
          this.productImage.create({ url: imageURL }),
        ),
      });

      await this.productRepository.save(newProduct);

      return { ...newProduct, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(@Query() queryParams: PaginationDto) {
    const { limit = 10, offset = 0 } = queryParams;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
  }

  async findOne(searchParam: string) {
    let productFound: Product | null;
    const isAValidUUID = validateUUIDV4(searchParam);

    if (isAValidUUID) {
      productFound = await this.productRepository.findOneBy({
        id: searchParam as UUID,
      });
    } else {
      const queryBuilder =
        this.productRepository.createQueryBuilder('products');
      productFound = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: searchParam.toUpperCase(),
          slug: searchParam.toLowerCase(),
        })
        .leftJoinAndSelect('products.images', 'productImages')
        .getOne();
    }

    if (productFound == null) {
      throw new NotFoundException(
        `The product with id/name/slug "${searchParam}" does not exits in db`,
      );
    }

    return productFound;
  }

  async update(id: UUID, updateProductDto: UpdateProductDto) {
    const { images = [], ...productDetails } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...productDetails,
      images: images as unknown as ProductImage[],
    });

    if (product == null)
      throw new NotFoundException(`The product with id ${id} was not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images?.[0] != null) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images?.map((imageURL) =>
          this.productImage.create({ product, url: imageURL }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: UUID) {
    const { affected } = await this.productRepository.delete({ id });

    if (affected === 0) {
      throw new NotFoundException(`The product with ${id} was not found`);
    }

    return `The product with #${id} has been deleted`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new ConflictException('The product name or slug is already taken');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Help me');
  }

  public deleteAllProducts = async () => {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    try {
      await queryBuilder.delete().where({}).execute();
      return 'OK';
    } catch (error) {
      this.handleDBExceptions(error);
    }
  };

  public insertManyProducts = async (productsSeed: SeedProduct[]) => {
    const promises: Array<Promise<SeedProduct>> = [];

    productsSeed.forEach((product) => {
      // @ts-expect-error lo espero totalmente
      promises.push(this.create(product));
    });

    await Promise.allSettled(promises);

    return 'OK';
  };
}
