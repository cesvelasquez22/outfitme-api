import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should create a new user and return a JWT token', async () => {
      const createUserDto = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password',
      };
      const userRecord = {
        id: 1,
        ...createUserDto,
        password: 'hashed-password',
        active: true,
      };
      jest.spyOn(userRepository, 'create').mockReturnValue(userRecord);
      jest.spyOn(userRepository, 'save').mockResolvedValue(undefined);
      const result = await authService.register(createUserDto);
      expect(result).toEqual({
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.fullName,
        token: 'jwt-token',
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(userRepository.save).toHaveBeenCalledWith(userRecord);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userRecord.id });
    });

    it('should throw a BadRequestException if user creation fails', async () => {
      const createUserDto = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password',
      };
      jest.spyOn(userRepository, 'create').mockImplementation(() => {
        throw new Error('Failed to create user');
      });
      await expect(authService.register(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return a token if the credentials are valid', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password',
      };
      const userRecord = {
        id: 1,
        email: credentials.email,
        fullName: 'Test User',
        password: bcrypt.hashSync(credentials.password, 10),
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userRecord);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await authService.login(credentials);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: credentials.email },
        select: { fullName: true, email: true, password: true, id: true },
      });
      expect(result).toEqual({
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.fullName,
        token: 'test-token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userRecord.id });
    });

    it('should throw an UnauthorizedException if the email is invalid', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.login(credentials)).rejects.toThrowError('Invalid credentials');
    });

    it('should throw an UnauthorizedException if the password is invalid', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password',
      };
      const userRecord = {
        id: 1,
        email: credentials.email,
        fullName: 'Test User',
        password: bcrypt.hashSync('wrong-password', 10),
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userRecord);

      await expect(authService.login(credentials)).rejects.toThrowError('Invalid credentials');
    });
  });
});
