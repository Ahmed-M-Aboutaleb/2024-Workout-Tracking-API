import { IsUserExistsRule } from './IsUserExists';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { UsersService } from '../../users.service';
import { rootMongooseTestModule } from '../../../../test/utils/db-connection';
import { User, UserSchema } from '../../entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

describe('IsUserExists', () => {
  let rule: IsUserExistsRule;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [IsUserExistsRule, UsersService],
    }).compile();
    rule = module.get<IsUserExistsRule>(IsUserExistsRule);
  });
  it('should be defined', () => {
    expect(rule).toBeDefined();
  });
  it('should return true if user email not exists', async () => {
    const result = await rule.validate('ahmed.aboutaleb.work@gmail.com', {
      property: 'email',
    } as ValidationArguments);
    expect(result).toBe(true);
  });
  it('should return true if user username not exists', async () => {
    const result = await rule.validate('iifire', {
      property: 'username',
    } as ValidationArguments);
    expect(result).toBe(true);
  });

  it('should return false on error', async () => {
    const result = await rule.validate('test', {
      property: 'invalid',
    } as ValidationArguments);
    expect(result).toBe(false);
  });

  it('defaultMessage should return "User already exists."', () => {
    expect(rule.defaultMessage()).toBe('User already exists.');
  });
});
