import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialProductData } from './data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}
  async populateDB() {
    const deletedProductStatus = await this.productService.deleteAllProducts();

    if (deletedProductStatus === 'OK') {
      await this.productService.insertManyProducts(initialProductData.products);
      return 'OK';
    }

    return 'Something went wrong';
  }
}
