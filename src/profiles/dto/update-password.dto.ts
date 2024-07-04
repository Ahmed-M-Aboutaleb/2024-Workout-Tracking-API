import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'The old password of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'The old password is required' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  oldPassword: string;
  @ApiProperty({
    example: 'P@ssw0rd_!',
    description: 'The new password of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'The new password is required' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
