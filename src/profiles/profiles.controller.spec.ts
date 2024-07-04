import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { rootMongooseTestModule } from '../../test/utils/db-connection';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), UsersModule, AuthModule],
      controllers: [ProfilesController],
      providers: [ProfilesService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
