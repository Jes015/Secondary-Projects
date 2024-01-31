import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(50)
    .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        'The password must have a Uppercase, lowercase letter and a number',
    }),
});

export class SignInUserDTO extends createZodDto(signInSchema) {}
