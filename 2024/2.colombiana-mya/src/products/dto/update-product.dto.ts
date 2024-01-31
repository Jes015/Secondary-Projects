import { createZodDto } from 'nestjs-zod';
import { createProductSchema } from './create-product.dto';

const updateProductDTO = createProductSchema.partial();

export class UpdateProductDto extends createZodDto(updateProductDTO) {}
