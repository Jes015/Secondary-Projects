import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createProductSchema = z.object({
  title: z.string().trim().min(1),
  price: z.coerce.number().positive().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  stock: z.coerce.number().positive().optional(),
  sizes: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
});

export class CreateProductDto extends createZodDto(createProductSchema) {}
