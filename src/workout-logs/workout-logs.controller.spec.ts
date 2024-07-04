import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutLogsController } from './workout-logs.controller';
import { WorkoutLogsService } from './workout-logs.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { Types } from 'mongoose';
import { Set } from '../sets/entities/set.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutLog, WorkoutLogSchema } from './entities/workout-log.entity';

describe('WorkoutLogsController', () => {
  let controller: WorkoutLogsController;
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

  let createdWorkoutLog;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: WorkoutLog.name, schema: WorkoutLogSchema },
        ]),
      ],
      controllers: [WorkoutLogsController],
      providers: [WorkoutLogsService],
    }).compile();

    controller = module.get<WorkoutLogsController>(WorkoutLogsController);
    createdWorkoutLog = await controller.create(workoutLogMock);
  });

  it('should create a new workout log', () => {
    expect(createdWorkoutLog).toBeDefined();
    expect(createdWorkoutLog).toHaveProperty('_id', createdWorkoutLog._id);
  });

  it('should return an array of workout logs', async () => {
    const allWorkoutLogs = await controller.findAll();
    expect(allWorkoutLogs).toBeDefined();
    expect(allWorkoutLogs).toBeInstanceOf(Array);
    expect(allWorkoutLogs).toHaveLength(1);
  });

  it('should return a specific workout log', async () => {
    const id: Types.ObjectId = createdWorkoutLog._id;
    const workoutLog = await controller.findOne(id);
    expect(workoutLog).toBeDefined();
    expect(workoutLog).toHaveProperty('_id', id);
  });

  it('should update a specific workout log', async () => {
    const id: Types.ObjectId = createdWorkoutLog._id;
    createdWorkoutLog.duration = 20;
    const updatedWorkoutLog = await controller.update(id, createdWorkoutLog);
    expect(updatedWorkoutLog).toBeDefined();
    expect(updatedWorkoutLog).toHaveProperty(
      'duration',
      createdWorkoutLog.duration,
    );
  });

  it('should remove a specific workout log', async () => {
    const id: Types.ObjectId = createdWorkoutLog._id;
    const workoutLog = await controller.remove(id);
    expect(workoutLog).toBeDefined();
    expect(workoutLog).toHaveProperty('_id', id);
  });
});
