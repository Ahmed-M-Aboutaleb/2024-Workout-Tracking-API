import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { rootMongooseTestModule } from '../../test/utils/db-connection';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesService],
      imports: [rootMongooseTestModule(), UsersModule, AuthModule],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
