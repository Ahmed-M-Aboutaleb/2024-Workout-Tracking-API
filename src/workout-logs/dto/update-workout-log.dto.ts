import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutLogDto } from './create-workout-log.dto';
import { Types } from 'mongoose';

export class UpdateWorkoutLogDto extends PartialType(CreateWorkoutLogDto) {
  _id: Types.ObjectId;
  createdAt: Date;
}
