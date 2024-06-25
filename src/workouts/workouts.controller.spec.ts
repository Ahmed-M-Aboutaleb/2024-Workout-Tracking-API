import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { Workout, WorkoutSchema } from './entities/workout.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { IsArrayValidRule } from './validators/rules/IsArrayValidRule';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { IsWorkoutExistsRule } from './validators/rules/IsWorkoutExists';

describe('WorkoutsController', () => {
  let controller: WorkoutsController;
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
      controllers: [WorkoutsController],
      providers: [WorkoutsService, IsArrayValidRule, IsWorkoutExistsRule],
    }).compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
    createdWorkout = await controller.create(createWorkoutDto);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const workouts = await controller.findAll();
      expect(workouts).toBeDefined();
      expect(workouts).toBeInstanceOf(Array);
      expect(workouts).toHaveLength(1);
    });
    it('should find a workout by id', async () => {
      const workout = await controller.findOne(createdWorkout._id);
      expect(workout).toBeDefined();
      expect(workout).toHaveProperty('_id', createdWorkout._id);
    });
    it('should update a workout', async () => {
      const workouts = await controller.findAll();
      expect(workouts).toBeDefined();
      expect(workouts).toBeInstanceOf(Array);
      expect(workouts).toHaveLength(1);
      const updatedWorkout = await controller.update(createdWorkout._id, {
        _id: createdWorkout._id,
        name: 'Squat',
        description: 'Leg workout',
        muscleGroups: ['Hamstrings'],
        equipment: 'Barbell',
        createdAt: createdWorkout.createdAt,
      });
      expect(updatedWorkout).toBeDefined();
      expect(updatedWorkout).toHaveProperty('_id', createdWorkout._id);
      expect(updatedWorkout).toHaveProperty('name', 'Squat');
      expect(updatedWorkout).toHaveProperty('description', 'Leg workout');
      expect(updatedWorkout).toHaveProperty('muscleGroups', ['Hamstrings']);
      expect(updatedWorkout).toHaveProperty('equipment', 'Barbell');
    });
    it('should delete a workout', async () => {
      const deletedWorkout = await controller.remove(createdWorkout._id);
      expect(deletedWorkout).toBeDefined();
      expect(deletedWorkout).toHaveProperty('_id', createdWorkout._id);
    });
  });
});
