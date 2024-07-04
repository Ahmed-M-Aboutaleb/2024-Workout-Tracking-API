import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workout, WorkoutSchema } from './entities/workout.entity';
import { IsArrayValidRule } from './validators/rules/IsArrayValidRule';
import { IsWorkoutExistsRule } from './validators/rules/IsWorkoutExists';
import { PayloadVerifier, TokenExtractor } from '../roles/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema }]),
  ],
  controllers: [WorkoutsController],
  providers: [
    WorkoutsService,
    IsArrayValidRule,
    IsWorkoutExistsRule,
    TokenExtractor,
    PayloadVerifier,
    JwtService,
  ],
  exports: [WorkoutsService, MongooseModule],
})
export class WorkoutsModule {}
