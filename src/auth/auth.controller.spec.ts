import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: UsersService;
  const password = 'P@ssw0rd';
  let createUserDto = {
    firstName: 'Ahmed',
    lastName: 'Aboutaleb',
    username: 'iifire',
    email: 'ahmed.aboutaleb.work@gmail.com',
    password: password,
  } as CreateUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, UsersService, PassportModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
    createUserDto = {
      ...createUserDto,
      password: await argon2.hash(password),
    };
    await usersService.create(createUserDto);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const data: AuthDto = {
        username: createUserDto.username,
        password: password,
      };
      const token = await controller.login(data);
      expect(token).toBeDefined();
      expect(token).toHaveProperty('access_token');
    });
  });

  describe('signup', () => {
    it('should return a token', async () => {
      createUserDto.email = 'newTest@gmail.com';
      createUserDto.username = 'newTest';
      createUserDto.password = password;
      const user = await controller.signup(createUserDto);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('access_token');
    });
  });
});
