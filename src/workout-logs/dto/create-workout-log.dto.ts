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
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkoutLogDto {
  @ApiProperty({
    example: [
      {
        _id: '5f9d88f4f5d8c3e6e4a1c9f2',
        name: 'Bench Press',
        description: 'Chest workout',
        muscleGroups: ['Chest'],
        equipment: 'Barbell',
        image: 'bench-press.png',
        restTime: 120,
        createdAt: '2021-05-01T00:00:00.000Z',
      },
    ],
    description: 'The workouts of the workout log',
    required: true,
    type: [Workout],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Workout)
  workouts: Workout[];
  @ApiProperty({
    example: '5f9d88f4f5d8c3e6e4a1c9f2',
    description: 'The user ID of the workout log',
    required: true,
    type: String,
  })
  @IsMongoId()
  userID: Types.ObjectId;
  @ApiProperty({
    example: 60,
    description: 'The duration of the workout log',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Min(0)
  duration?: number;
}
