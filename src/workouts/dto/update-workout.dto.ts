import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWorkoutDto } from './create-workout.dto';
import { Types } from 'mongoose';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @ApiProperty({
    example: '5f9d88f4f5d8c3e6e4a1c9f2',
    description: 'The ID of the workout',
    required: true,
    type: String,
  })
  _id: Types.ObjectId;
  @ApiProperty({
    example: '2021-05-01T00:00:00.000Z',
    description: 'The creation date of the workout',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
