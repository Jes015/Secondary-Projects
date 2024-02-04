import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.guard';
import { GetUser } from './decorators/get-user.detocator';
import { SignInUserDTO } from './dto';
import { RegisterUserDTO } from './dto/user-register.dto';
import { User } from './entities/user.entity';
import { CValidRoles } from './models/roles.model';

@ApiTags('Auth')
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
  testingPrivateRoute() {
    return {
      ok: true,
    };
  }
}
