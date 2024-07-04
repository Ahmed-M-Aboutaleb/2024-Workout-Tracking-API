import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWorkoutLogDto } from './create-workout-log.dto';
import { Types } from 'mongoose';

export class UpdateWorkoutLogDto extends PartialType(CreateWorkoutLogDto) {
  @ApiProperty({
    example: '5f9d88f4f5d8c3e6e4a1c9f2',
    description: 'The user ID of the workout log',
    required: true,
    type: String,
  })
  _id: Types.ObjectId;
  @ApiProperty({
    example: '2021-05-01T00:00:00.000Z',
    description: 'The creation date of the workout log',
    required: true,
    type: Date,
  })
  createdAt: Date;
}
