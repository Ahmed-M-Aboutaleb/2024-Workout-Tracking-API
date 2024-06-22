import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IsUserExistsRule } from './validators/rules/IsUserExists';
import { PayloadVerifier, TokenExtractor } from '../roles/roles.guard';
import { JwtService } from '@nestjs/jwt';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let createdUser;
  const createUserDto = {
    firstName: 'Ahmed',
    lastName: 'Aboutaleb',
    username: 'iifire',
    email: 'ahmed.aboutaleb.work@gmail.com',
    password: 'P@ssw0rd',
  } as CreateUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        IsUserExistsRule,
        UsersService,
        TokenExtractor,
        PayloadVerifier,
        JwtService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    createdUser = await service.create(createUserDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a user', async () => {
      expect(createdUser).toBeDefined();
      expect(createdUser).toHaveProperty('_id');
      expect(createdUser).toHaveProperty('firstName', createUserDto.firstName);
      expect(createdUser).toHaveProperty('lastName', createUserDto.lastName);
      expect(createdUser).toHaveProperty('username', createUserDto.username);
      expect(createdUser).toHaveProperty('email', createUserDto.email);
    });
    it('should find all users', async () => {
      const users = await service.findAll();
      expect(users).toBeDefined();
      expect(users).toBeInstanceOf(Array);
    });
    it('should find a user by id', async () => {
      const users = await service.findAll();
      const user = await service.findOne(users[0]._id);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', users[0]._id);
    });
    it('should find a user by username', async () => {
      const users = await service.findAll();
      const user = await service.findOneByUsername(users[0].username);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('username', users[0].username);
    });
    it('should find a user by email', async () => {
      const users = await service.findAll();
      const user = await service.findOneByEmail(users[0].email);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('email', users[0].email);
    });
    it('should update a user', async () => {
      const users = await service.findAll();
      const user = await service.update(users[0]._id, {
        firstName: 'Mohamed',
        lastName: 'Aboutaleb',
        username: 'iifire',
        email: 'ahmed.aboutaleb.work@gmail.com',
        password: 'P@ssw0rd',
        _id: users[0]._id,
        createdAt: users[0].createdAt,
      });
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', users[0]._id);
      expect(user).toHaveProperty('firstName', 'Mohamed');
    });
    it('should delete a user', async () => {
      const users = await service.findAll();
      const user = await service.delete(users[0]._id);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', users[0]._id);
    });
  });
  afterAll(async () => {
    await service.delete(createdUser._id);
    await closeInMongodConnection();
  });
});
