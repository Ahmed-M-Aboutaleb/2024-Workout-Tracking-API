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

export class CreateWorkoutDto {
  @IsString()
  @IsWorkoutExists()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @ArrayMinSize(1)
  @IsArrayValid({ each: true, message: 'Invalid muscle groups!' })
  muscleGroups: MuscleGroup[];
  @IsAlpha()
  @IsArrayValid({ message: 'Invalid equipment!' })
  equipment: string;
  @IsOptional()
  @IsString()
  image?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  restTime?: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Set)
  sets?: [];
  @IsOptional()
  @IsString()
  userID?: string;
}
