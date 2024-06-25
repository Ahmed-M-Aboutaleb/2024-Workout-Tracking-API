import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsWorkoutExistsRule } from './rules/IsWorkoutExists';

export function IsWorkoutExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsWorkoutExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsWorkoutExistsRule,
    });
  };
}
