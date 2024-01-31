import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const paginationDtoSchema = z.object({
  limit: z.coerce.number().min(0).default(10).optional(),
  offset: z.coerce.number().min(0).default(0).optional(),
});

export class PaginationDto extends createZodDto(paginationDtoSchema) {}
