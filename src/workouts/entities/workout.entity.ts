import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Set } from '../../sets/entities/set.entity';

export type MuscleGroup =
  | 'Abdominals'
  | 'Biceps'
  | 'Triceps'
  | 'Forearms'
  | 'Chest'
  | 'Lats'
  | 'Lower Back'
  | 'Upper Back'
  | 'Traps'
  | 'Shoulders'
  | 'Hamstrings'
  | 'Glutes'
  | 'Calves'
  | 'Quadriceps';

export type Equipment =
  | 'Barbell'
  | 'Dumbbell'
  | 'Cable'
  | 'Machine'
  | 'Bodyweight';

@Schema({ collection: 'workouts', timestamps: true })
export class Workout {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true, unique: true, type: String })
  name: string;
  @Prop({ type: String, default: 'Awsome workout!' })
  description: string;
  @Prop({ required: true, type: [String] })
  muscleGroups: MuscleGroup[];
  @Prop({ required: true, type: String })
  equipment: Equipment;
  @Prop({ type: String, default: 'none.png' })
  image: string;
  @Prop({ type: Number, default: 0 })
  restTime: number;
  @Prop({ type: [Set], default: [] })
  sets: Set[];
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  userID: Types.ObjectId;
  @Prop({ type: Date })
  createdAt: Date;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);
