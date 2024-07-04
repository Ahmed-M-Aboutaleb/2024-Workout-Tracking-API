import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Types } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: '5f9d88f4f5d8c3e6e4a1c9f2',
    description: 'The id of the user',
    required: true,
    type: String,
  })
  _id: Types.ObjectId;
  @ApiProperty({
    example: '2021-05-01T00:00:00.000Z',
    description: 'The date the user was created',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
