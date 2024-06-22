import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsUserExistsRule } from './validators/rules/IsUserExists';
import { PayloadVerifier, TokenExtractor } from '../roles/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
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
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController);
    createdUser = await controller.create(createUserDto);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const users = await controller.findAll();
      expect(users).toBeDefined();
      expect(users).toBeInstanceOf(Array);
    });

    it('should find a user by id', async () => {
      const user = await controller.findOne(createdUser._id);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', createdUser._id);
    });

    it('should update a user', async () => {
      const users = await controller.findAll();
      const updatedUser = await controller.update(createdUser._id, {
        firstName: 'Mohamed',
        lastName: 'Aboutaleb',
        username: 'iifire',
        email: 'ahmed.aboutaleb.work@gmail.com',
        password: 'P@ssw0rd',
        _id: users[0]._id,
        createdAt: users[0].createdAt,
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser).toHaveProperty('_id', createdUser._id);
      expect(updatedUser).toHaveProperty('firstName', 'Mohamed');
    });

    it('should remove a user', async () => {
      const removedUser = await controller.remove(createdUser._id);
      expect(removedUser).toBeDefined();
      expect(removedUser).toHaveProperty('_id', createdUser._id);
    });
  });
});
