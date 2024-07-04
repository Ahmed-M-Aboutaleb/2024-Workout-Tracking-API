import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';

type Token = Promise<{ access_token: string }>;

export interface Payload {
  username: string;
  userID: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user || (await argon2.verify(user.password, password)))
      throw new Error('Invalid credentials');
    return user;
  }

  async login(authDto: AuthDto): Token {
    const user = await this.validateUser(authDto.username, authDto.password);
    const payload: Payload = {
      username: authDto.username,
      userID: user._id.toString(),
      role: user.role,
    };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Token {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.login({ username: user.username, password: hashedPassword });
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
