import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto';
import { GetUser, Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() credentials: CredentialsDto) {
    return this.authService.login(credentials);
  }

  @Get('me')
  getProfile(@GetUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }
}
