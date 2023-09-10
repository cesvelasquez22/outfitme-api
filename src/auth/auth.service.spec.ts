import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', () => {
    const user: CreateUserDto = {
      email: 'ces.velasquez@hotmail',
      password: '123456',
      fullName: 'Cesar Velasquez',
    };
    expect(service.register(user)).toEqual({
      id: expect.any(Number),
      email: user.email,
    });
  });
});
