import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Workout } from '../../workouts/entities/workout.entity';
import { Types } from 'mongoose';

export class CreateWorkoutLogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Workout)
  workouts: Workout[];
  @IsMongoId()
  userID: Types.ObjectId;
  @IsOptional()
  @Min(0)
  duration?: number;
}
