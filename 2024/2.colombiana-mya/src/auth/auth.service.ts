import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async signIn(signInUserDTO: SignInUserDTO) {
    const userFound = await this.userRepository.findOne({
      where: { email: signInUserDTO.email },
      select: { email: true, password: true, id: true },
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

    const jwtToken = {
      ...userFound,
      token: this.getJwtToken({ id: userFound.id }),
    };
    return jwtToken;
  }

  async signUp(registerUserDTO: RegisterUserDTO) {
    try {
      registerUserDTO.password = hashSync(registerUserDTO.password, 10);

      const user = this.userRepository.create(registerUserDTO);
      await this.userRepository.save(user);

      const userData: Partial<typeof user> = structuredClone(user);
      delete userData.password;

      const jwtToken = {
        ...userData,
        token: this.getJwtToken({ id: userData.id }),
      };
      return jwtToken;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private getJwtToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  public async checkJwtToken(user: User) {
    if (user == null) {
      throw new BadRequestException('You need to provide an user id');
    }

    const dataToReturn = {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };

    return dataToReturn;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Server: Something went wrong');
  }
}
