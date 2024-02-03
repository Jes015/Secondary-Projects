import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { SeedProduct, SeedUserArray, initialProductData } from './data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async populateDB() {
    const deletedProductStatus = await this.productService.deleteAllProducts();

    await this.deleteAllUsers();
    const adminUser = await this.insetManyUsers(initialProductData.users);

    if (deletedProductStatus === 'OK') {
      await this.insertManyProducts(initialProductData.products, adminUser);
      return 'OK';
    }

    return 'Something went wrong';
  }

  public deleteAllUsers = async () => {
    const queryBuilder = this.userRepository.createQueryBuilder('users');
    await queryBuilder.delete().where({}).execute();
  };

  public insetManyUsers = async (users: SeedUserArray) => {
    let usersInserted: User[] = [];

    const usersToInsert = users.map((user) =>
      this.userRepository.create({
        ...user,
        password: hashSync(user.password, 10),
      }),
    );

    usersInserted = await this.userRepository.save(usersToInsert);

    return usersInserted[0];
  };

  public insertManyProducts = async (
    productsSeed: SeedProduct[],
    user: User,
  ) => {
    const promises = productsSeed.map((product) =>
      this.productService.create(product, user),
    );

    Promise.allSettled(promises);
    return 'OK';
  };
}
