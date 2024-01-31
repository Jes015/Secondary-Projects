import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const registerUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(5),
  password: z
    .string()
    .min(6)
    .max(50)
    .regex(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        'The password must have a Uppercase, lowercase letter and a number',
    }),
});

export class RegisterUserDTO extends createZodDto(registerUserSchema) {}
