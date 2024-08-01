import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('signup')
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists',
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
