import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutDto } from './create-workout.dto';
import { Types } from 'mongoose';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  _id: Types.ObjectId;
  createdAt: Date;
}
