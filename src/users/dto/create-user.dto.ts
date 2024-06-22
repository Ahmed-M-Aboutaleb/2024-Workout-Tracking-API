import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { IsUserExists } from '../validators/IsUserExists';

export class CreateUserDto {
  @IsAlpha()
  firstName: string;
  @IsAlpha()
  lastName: string;
  @IsNotEmpty({ message: 'Username is required' })
  @IsUserExists({ message: 'Username already exists' })
  username: string;
  @IsEmail()
  @IsUserExists({ message: 'Email already exists' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
