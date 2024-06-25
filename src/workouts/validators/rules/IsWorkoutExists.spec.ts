import { IsWorkoutExistsRule } from './IsWorkoutExists';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { WorkoutsService } from '../../workouts.service';
import { rootMongooseTestModule } from '../../../../test/utils/db-connection';
import { Workout, WorkoutSchema } from '../../entities/workout.entity';
import { MongooseModule } from '@nestjs/mongoose';

describe('IsUserExists', () => {
  let rule: IsWorkoutExistsRule;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Workout.name, schema: WorkoutSchema },
        ]),
      ],
      providers: [IsWorkoutExistsRule, WorkoutsService],
    }).compile();
    rule = module.get<IsWorkoutExistsRule>(IsWorkoutExistsRule);
  });
  it('should be defined', () => {
    expect(rule).toBeDefined();
  });
  it('should return true if user name not exists', async () => {
    const result = await rule.validate('bench press', {
      property: 'name',
    } as ValidationArguments);
    expect(result).toBe(true);
  });

  it('should return false on error', async () => {
    const result = await rule.validate('test', {
      property: 'invalid',
    } as ValidationArguments);
    expect(result).toBe(false);
  });

  it('defaultMessage should return "Workout already exists."', () => {
    expect(rule.defaultMessage()).toBe('Workout already exists.');
  });
});
