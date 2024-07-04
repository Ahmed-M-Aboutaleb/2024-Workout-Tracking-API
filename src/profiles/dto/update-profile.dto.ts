import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProfileDto {
  @ApiProperty({
    example: '5f9d88f4f5d8c3e6e4a1c9f2',
    description: 'The id of the user',
    required: true,
    type: String,
  })
  _id: Types.ObjectId;
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
  username: string;
  @ApiProperty({
    example: 'user@domain.com',
    description: 'The email of the user',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '2021-05-01T00:00:00.000Z',
    description: 'The date the user was created',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
