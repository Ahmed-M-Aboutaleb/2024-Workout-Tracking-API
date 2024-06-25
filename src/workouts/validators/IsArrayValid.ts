import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsArrayValidRule } from './rules/IsArrayValidRule';

export function IsArrayValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsArrayValidRule,
    });
  };
}
