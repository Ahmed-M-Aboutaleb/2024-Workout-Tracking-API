import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../../users.service';

@ValidatorConstraint({ name: 'IsUserExists', async: true })
@Injectable()
export class IsUserExistsRule implements ValidatorConstraintInterface {
  constructor(private userService: UsersService) {}

  async validate(payload: string, args: ValidationArguments) {
    try {
      const user = await this.findUser(payload, args.property);
      return !user;
    } catch (e) {
      return false;
    }
  }

  private async findUser(payload: string, property: string) {
    switch (property) {
      case 'username':
        return await this.userService.findOneByUsername(payload);
      case 'email':
        return await this.userService.findOneByEmail(payload);
      default:
        throw new Error(`Invalid property: ${property}`);
    }
  }

  defaultMessage() {
    return `User already exists.`;
  }
}
