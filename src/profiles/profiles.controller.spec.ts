import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../test/utils/db-connection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let usersService: UsersService;
  let authService: AuthService;
  let createdUser: any;

  const user: CreateUserDto = {
    firstName: 'Ahmed',
    lastName: 'Aboutaleb',
    username: 'test',
    email: 'test@test.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '60s' },
        }),
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        UsersService,
        AuthService,
        JwtService,
        ConfigService,
        JwtStrategy,
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);

    const hashedPassword = await authService.hashPassword(user.password);
    createdUser = await usersService.create({
      ...user,
      password: hashedPassword,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('RUD operations', () => {
    it('should find all profiles', async () => {
      const profiles = await controller.findAll();
      expect(profiles).toBeDefined();
      expect(profiles).toBeInstanceOf(Array);
    });

    it('should find a profile by username', async () => {
      const profile = await controller.findOne(user.username);
      expect(profile).toBeDefined();
      expect(profile.user).toHaveProperty('username', user.username);
    });

    it('should update a profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        _id: createdUser._id,
        firstName: 'Ahmed',
        lastName: 'Aboutaleb',
        username: 'test',
        email: 'test@gmail.com',
        createdAt: createdUser.createdAt,
      };
      const req = { user: { userID: createdUser._id } };
      const updatedProfile = await controller.update(
        req as any,
        updateProfileDto,
      );
      expect(updatedProfile).toBeDefined();
      expect(updatedProfile.user).toHaveProperty(
        'firstName',
        updateProfileDto.firstName,
      );
    });

    it('should delete a profile', async () => {
      const req = {
        user: {
          userID: createdUser._id,
        },
      };
      const deletedProfile = await controller.remove(req as any);
      expect(deletedProfile).toBeDefined();
      expect(deletedProfile.user).toHaveProperty('_id', createdUser._id);
    });
  });

  afterAll(async () => {
    await usersService.delete(createdUser._id);
    await closeInMongodConnection();
  });
});
