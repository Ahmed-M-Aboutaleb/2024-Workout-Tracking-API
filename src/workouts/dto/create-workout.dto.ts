import {
  ArrayMinSize,
  IsAlpha,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { MuscleGroup } from '../entities/workout.entity';
import { IsArrayValid } from '../validators/IsArrayValid';
import { Type } from 'class-transformer';
import { Set } from '../../sets/entities/set.entity';
import { IsWorkoutExists } from '../validators/IsWorkoutExists';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkoutDto {
  @ApiProperty({
    example: 'Bench Press',
    description: 'The name of the workout',
    required: true,
    type: String,
  })
  @IsString()
  @IsWorkoutExists()
  name: string;
  @ApiProperty({
    example: 'Chest workout',
    description: 'The description of the workout',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    example: ['Chest'],
    description: 'The muscle groups of the workout',
    required: true,
    type: [String],
  })
  @ArrayMinSize(1)
  @IsArrayValid({ each: true, message: 'Invalid muscle groups!' })
  muscleGroups: MuscleGroup[];
  @ApiProperty({
    example: ['Barbell'],
    description: 'The equipment of the workout',
    required: true,
    type: String,
  })
  @IsAlpha()
  @IsArrayValid({ message: 'Invalid equipment!' })
  equipment: string;
  @ApiProperty({
    example: 'bench-press.png',
    description: 'The image of the workout',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  image?: string;
  @ApiProperty({
    example: 120,
    description: 'The rest time of the workout',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  restTime?: number;
  @ApiProperty({
    example: [
      {
        weight: 100,
        reps: 10,
      },
    ],
    description: 'The sets of the workout',
    required: false,
    type: [Set],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Set)
  sets?: [];
  @ApiProperty({
    example: '5f9d88f4f5d8c3e6e4a1c9f2',
    description: 'The user ID of the workout',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  userID?: string;
}
