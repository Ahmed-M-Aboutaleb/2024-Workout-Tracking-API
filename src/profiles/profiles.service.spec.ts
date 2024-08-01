import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/db-connection';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let userService: UsersService;
  let authService: AuthService;
  let createdUser;

  let createUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(), // Add ConfigModule
        JwtModule.register({
          secret: 'testSecret', // Provide a test secret or use ConfigService
          signOptions: { expiresIn: '60s' },
        }),
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        ProfilesService,
        UsersService,
        AuthService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    createUserDto = {
      firstName: 'Ahmed',
      lastName: 'Aboutaleb',
      username: 'iifire',
      email: 'ahmed.aboutaleb.work@gmail.com',
      password: await authService.hashPassword('P@ssw0rd'),
    } as CreateUserDto;
    createdUser = await userService.create(createUserDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should find all profiles', async () => {
      const profiles = await service.findAll();
      expect(profiles).toBeDefined();
      expect(profiles).toBeInstanceOf(Array);
    });

    it('should find a profile by username', async () => {
      const profile = await service.findOne(createdUser.username);
      expect(profile).toBeDefined();
      expect(profile.user).toHaveProperty('username', createdUser.username);
    });

    it('should update a profile', async () => {
      const updateProfileDto = {
        firstName: 'Mohamed',
        lastName: 'Aboutaleb',
      } as UpdateProfileDto;

      const updatedProfile = await service.update(
        createdUser._id,
        updateProfileDto,
      );

      expect(updatedProfile).toBeDefined();
      expect(updatedProfile.user).toHaveProperty('firstName', 'Mohamed');
    });

    it('should delete a profile', async () => {
      const deletedProfile = await service.delete(createdUser._id);
      expect(deletedProfile).toBeDefined();
      expect(deletedProfile.user).toHaveProperty('_id', createdUser._id);
    });

    it('should update a user password', async () => {
      const updatePasswordDto = {
        oldPassword: 'P@ssw0rd',
        newPassword: 'N3wP@ssw0rd',
      } as UpdatePasswordDto;

      const updatedProfile = await service.updatePassword(
        createdUser._id,
        updatePasswordDto,
      );

      expect(updatedProfile).toBeDefined();
      expect(updatedProfile.user).toHaveProperty(
        'username',
        createdUser.username,
      );
    });
  });

  afterAll(async () => {
    await userService.delete(createdUser._id);
    await closeInMongodConnection();
  });
});
