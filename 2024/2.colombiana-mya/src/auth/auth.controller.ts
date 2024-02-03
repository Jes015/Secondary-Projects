import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.guard';
import { GetUser } from './decorators/get-user.detocator';
import { GetHeaders } from './decorators/raw-headers.decorator';
import { SignInUserDTO } from './dto';
import { RegisterUserDTO } from './dto/user-register.dto';
import { User } from './entities/user.entity';
import { CValidRoles } from './models/roles.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-auth')
  @Auth(CValidRoles.user)
  checkJwtToken(@GetUser() user: User) {
    return this.authService.checkJwtToken(user);
  }

  @Post('signUp')
  signUp(@Body() registerUserDto: RegisterUserDTO) {
    return this.authService.signUp(registerUserDto);
  }

  @Post('signIn')
  signIn(@Body() registerUserDto: SignInUserDTO) {
    return this.authService.signIn(registerUserDto);
  }

  @Get('private')
  @Auth(CValidRoles.user, CValidRoles.admin)
  testingPrivateRoute(
    @GetHeaders() headers: string[],
    @GetUser('roles') user: string[],
  ) {
    return {
      ok: true,
    };
  }
}
