import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { WorkoutsService } from '../../workouts.service';

@ValidatorConstraint({ name: 'IsWorkoutExists', async: true })
@Injectable()
export class IsWorkoutExistsRule implements ValidatorConstraintInterface {
  constructor(private workoutService: WorkoutsService) {}

  async validate(payload: string, args: ValidationArguments) {
    try {
      const workout = await this.findWorkout(payload, args.property);
      return !workout;
    } catch (e) {
      return false;
    }
  }

  private async findWorkout(payload: string, property: string) {
    switch (property) {
      case 'name':
        return await this.workoutService.findOneByName(payload);
      default:
        throw new Error(`Invalid property: ${property}`);
    }
  }

  defaultMessage() {
    return `Workout already exists.`;
  }
}
