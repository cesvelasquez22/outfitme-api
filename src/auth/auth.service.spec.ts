import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

// FIXME Unit tests are failing
// import { CreateUserDto } from './dto';

// Firebase
import { FirebaseModule } from '../firebase/firebase.module';
// import { FirebaseService } from '../firebase/firebase.service';

describe('AuthService', () => {
  let service: AuthService;
  // let firebaseService: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FirebaseModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('register', () => {
  //   it('should register a user', async () => {
  //     const user: CreateUserDto = {
  //       email: 'ces.velasquez@hotmail',
  //       password: 'KlOp1234',
  //       fullName: 'Cesar Velasquez',
  //     };

  //     expect(service.register(user)).toEqual({
  //       id: expect.any(String),
  //       email: user.email,
  //       fullName: user.fullName,
  //     });
  //   });
  // });
});
