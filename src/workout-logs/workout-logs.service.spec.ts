import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutLogsService } from './workout-logs.service';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutLog, WorkoutLogSchema } from './entities/workout-log.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { Set } from '../sets/entities/set.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { Types } from 'mongoose';

describe('WorkoutLogsService', () => {
  let service: WorkoutLogsService;
  let createdWorkoutLog;
  const setsMock: Set[] = [
    {
      type: 'Normal',
      reps: 10,
      weight: 50,
      weightUnit: 'kg',
      isDone: false,
      previousSet: null,
    },
  ];
  const workoutMock: Workout = {
    _id: new Types.ObjectId(),
    name: 'Bench Press',
    description: 'Chest workout',
    muscleGroups: ['Chest'],
    equipment: 'Barbell',
    image: 'image',
    createdAt: new Date(),
    restTime: 60,
    userID: new Types.ObjectId(),
    sets: setsMock,
  };

  const workoutLogMock: CreateWorkoutLogDto = {
    workouts: [workoutMock],
    userID: new Types.ObjectId(),
    duration: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: WorkoutLog.name, schema: WorkoutLogSchema },
        ]),
      ],
      providers: [WorkoutLogsService],
    }).compile();

    service = module.get<WorkoutLogsService>(WorkoutLogsService);
    createdWorkoutLog = await service.create(workoutLogMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a workout log', async () => {
      expect(createdWorkoutLog).toBeDefined();
      expect(createdWorkoutLog).toHaveProperty('_id');
      expect(createdWorkoutLog).toHaveProperty('workouts');
      expect(createdWorkoutLog).toHaveProperty('userID', workoutLogMock.userID);
      expect(createdWorkoutLog).toHaveProperty(
        'duration',
        workoutLogMock.duration,
      );
    });

    it('should find all workout logs', async () => {
      const workoutLogs = await service.findAll();
      expect(workoutLogs).toBeDefined();
      expect(workoutLogs).toBeInstanceOf(Array);
      expect(workoutLogs).toHaveLength(1);
    });

    it('should find a workout log by id', async () => {
      const workoutLog = await service.findOne(createdWorkoutLog._id);
      expect(workoutLog).toBeDefined();
      expect(workoutLog).toHaveProperty('_id', createdWorkoutLog._id);
    });

    it('should update a workout log', async () => {
      createdWorkoutLog.duration = 20;
      const updatedWorkoutLog = await service.update(
        createdWorkoutLog._id,
        createdWorkoutLog,
      );
      expect(updatedWorkoutLog).toBeDefined();
      expect(updatedWorkoutLog).toHaveProperty('duration', 20);
    });

    it('should remove a workout log', async () => {
      const removedWorkoutLog = await service.delete(createdWorkoutLog._id);
      expect(removedWorkoutLog).toBeDefined();
      expect(removedWorkoutLog).toHaveProperty('_id', createdWorkoutLog._id);
      const workoutLogsAfterRemoval = await service.findAll();
      expect(workoutLogsAfterRemoval).toHaveLength(0);
    });
  });
});
