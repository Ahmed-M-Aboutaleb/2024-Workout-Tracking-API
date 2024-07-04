import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { IsUserExists } from '../validators/IsUserExists';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ahmed',
    description: 'The first name of the user',
    required: true,
    type: String,
  })
  @IsAlpha()
  firstName: string;
  @ApiProperty({
    example: 'Aboutaleb',
    description: 'The last name of the user',
    required: true,
    type: String,
  })
  @IsAlpha()
  lastName: string;
  @ApiProperty({
    example: 'username',
    description: 'The username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsUserExists({ message: 'Username already exists' })
  username: string;
  @ApiProperty({
    example: 'user@domain.com',
    description: 'The email of the user',
    required: true,
    type: String,
  })
  @IsEmail()
  @IsUserExists({ message: 'Email already exists' })
  email: string;
  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'The password of the user',
    required: true,
    type: String,
  })
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
