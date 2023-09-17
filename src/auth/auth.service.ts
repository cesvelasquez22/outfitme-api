import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, CredentialsDto } from './dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = createUserDto;
      const userRecord = this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(userRecord);
      return {
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.fullName,
        token: this.getJwt({ id: userRecord.id }),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(credentials: CredentialsDto) {
    const { password, email } = credentials;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { fullName: true, email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, email: user.email, fullName: user.fullName, token: this.getJwt({ id: user.id }) };
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
