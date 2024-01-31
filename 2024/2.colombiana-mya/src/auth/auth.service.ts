import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterUserDTO, SignInUserDTO } from './dto/';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.logger = new Logger('AuthService');
  }

  async signIn(signInUserDTO: SignInUserDTO) {
    const userFound = await this.userRepository.findOne({
      where: { email: signInUserDTO.email },
      select: { email: true, password: true },
    });

    if (userFound == null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isAValidPassword = compareSync(
      signInUserDTO.password,
      userFound.password,
    );

    if (!isAValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return 'AUTHENTICATED SUCCESSFULLY';
    // TODO: return jwt
  }

  async signUp(registerUserDTO: RegisterUserDTO) {
    try {
      registerUserDTO.password = hashSync(registerUserDTO.password, 10);

      const user = this.userRepository.create(registerUserDTO);
      await this.userRepository.save(user);

      const userData: Partial<typeof user> = structuredClone(user);
      delete userData.password;

      return userData;

      // TODO: return jwt
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Server: Something went wrong');
  }
}
