import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtModule } from '@nestjs/jwt';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let createdUser;
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
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    createUserDto = {
      ...createUserDto,
      password: await argon2.hash(password),
    };
    createdUser = await usersService.create(createUserDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const authUser = {
        username: createUserDto.username,
        password: password,
      };
      const token = await service.login(authUser);
      expect(token).toBeDefined();
      expect(token).toHaveProperty('access_token');
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      const user = await service.validateUser(createUserDto.username, password);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', createdUser._id);
    });
  });

  describe('signup', () => {
    it('should return a token', async () => {
      createUserDto = {
        ...createUserDto,
        username: 'newUser',
        email: 'newTest@gmail.com',
        password: password,
      };
      const token = await service.signup(createUserDto);
      expect(token).toBeDefined();
      expect(token).toHaveProperty('access_token');
    });
  });

  afterAll(async () => {
    await usersService.delete(createdUser._id);
    await closeInMongodConnection();
  });
});
