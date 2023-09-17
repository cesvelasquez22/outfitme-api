import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
