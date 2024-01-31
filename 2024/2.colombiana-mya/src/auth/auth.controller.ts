import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDTO } from './dto';
import { RegisterUserDTO } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() registerUserDto: RegisterUserDTO) {
    return this.authService.signUp(registerUserDto);
  }

  @Post('signIn')
  signIn(@Body() registerUserDto: SignInUserDTO) {
    return this.authService.signIn(registerUserDto);
  }
}
