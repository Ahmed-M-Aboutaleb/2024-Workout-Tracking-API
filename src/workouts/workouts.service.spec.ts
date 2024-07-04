import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { Workout, WorkoutSchema } from './entities/workout.entity';
import { IsArrayValidRule } from './validators/rules/IsArrayValidRule';
import { IsWorkoutExistsRule } from './validators/rules/IsWorkoutExists';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let createdWorkout;
  const createWorkoutDto: CreateWorkoutDto = {
    name: 'Bench Press',
    description: 'Chest workout',
    muscleGroups: ['Chest'],
    equipment: 'Barbell',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Workout.name, schema: WorkoutSchema },
        ]),
      ],
      providers: [WorkoutsService, IsArrayValidRule, IsWorkoutExistsRule],
    }).compile();

    service = module.get<WorkoutsService>(WorkoutsService);
    createdWorkout = await service.create(createWorkoutDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('CRUD operations', () => {
    it('should create a workout', async () => {
      expect(createdWorkout).toBeDefined();
      expect(createdWorkout).toHaveProperty('_id');
      expect(createdWorkout).toHaveProperty('name', createWorkoutDto.name);
      expect(createdWorkout).toHaveProperty(
        'description',
        createWorkoutDto.description,
      );
      expect(createdWorkout).toHaveProperty(
        'muscleGroups',
        createWorkoutDto.muscleGroups,
      );
      expect(createdWorkout).toHaveProperty(
        'equipment',
        createWorkoutDto.equipment,
      );
    });
    it('should find all workouts', async () => {
      const workouts = await service.findAll();
      expect(workouts).toBeDefined();
      expect(workouts).toBeInstanceOf(Array);
      expect(workouts).toHaveLength(1);
    });
    it('should find a workout by id', async () => {
      const workout = await service.findOne(createdWorkout._id);
      expect(workout).toBeDefined();
      expect(workout).toHaveProperty('_id', createdWorkout._id);
    });
    it('should find a workout by name', async () => {
      const workout = await service.findOneByName(createWorkoutDto.name);
      expect(workout).toBeDefined();
      expect(workout).toHaveProperty('_id', createdWorkout._id);
    });
    it('should update a workout', async () => {
      const workouts = await service.findAll();
      const updatedWorkout = await service.update(createdWorkout._id, {
        _id: workouts[0]._id,
        createdAt: workouts[0].createdAt,
        name: 'Squat',
        description: 'Leg workout',
        muscleGroups: ['Hamstrings'],
        equipment: 'Barbell',
      });
      expect(updatedWorkout).toBeDefined();
      expect(updatedWorkout).toHaveProperty('_id', createdWorkout._id);
      expect(updatedWorkout).toHaveProperty('name', 'Squat');
      expect(updatedWorkout).toHaveProperty('description', 'Leg workout');
      expect(updatedWorkout).toHaveProperty('muscleGroups', ['Hamstrings']);
      expect(updatedWorkout).toHaveProperty('equipment', 'Barbell');
    });
    it('should delete a workout', async () => {
      const deletedWorkout = await service.delete(createdWorkout._id);
      expect(deletedWorkout).toBeDefined();
      expect(deletedWorkout).toHaveProperty('_id', createdWorkout._id);
    });
  });
});
