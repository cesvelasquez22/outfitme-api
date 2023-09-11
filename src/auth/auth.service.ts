import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const { email, password, fullName } = createUserDto;
      // TODO: COnsider use transaction or cloud function to prevent inconsistency
      const userRecord = await this.firebaseService.auth.createUser({
        email,
        password,
        displayName: fullName,
      });
      await this.userRepository.save({
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName,
      });
      return {
        id: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.displayName,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
