import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUserExistsRule } from './rules/IsUserExists';

export function IsUserExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserExistsRule,
    });
  };
}
