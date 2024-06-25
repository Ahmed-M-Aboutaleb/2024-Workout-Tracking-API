import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const MUSCLE_GROUPS = [
  'Abdominals',
  'Biceps',
  'Triceps',
  'Forearms',
  'Chest',
  'Lats',
  'Lower Back',
  'Upper Back',
  'Traps',
  'Shoulders',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Quadriceps',
];

const EQUIPMENTS = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'];

@ValidatorConstraint({ name: 'IsArrayValid', async: true })
@Injectable()
export class IsArrayValidRule implements ValidatorConstraintInterface {
  async validate(payload: string, args: ValidationArguments) {
    const checkType =
      args.property === 'muscleGroups' ? MUSCLE_GROUPS : EQUIPMENTS;
    return checkType.includes(payload);
  }

  defaultMessage() {
    return `Invalid Input!`;
  }
}
