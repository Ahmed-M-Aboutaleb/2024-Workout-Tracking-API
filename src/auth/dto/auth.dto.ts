import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'username',
    description: 'The username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;
  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'The password of the user',
    required: true,
    type: String,
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
