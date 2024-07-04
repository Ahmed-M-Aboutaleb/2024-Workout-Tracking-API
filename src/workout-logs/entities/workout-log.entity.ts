import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Workout } from '../../workouts/entities/workout.entity';

@Schema({ collection: 'workout-logs', timestamps: true })
export class WorkoutLog {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true, type: [Workout] })
  workouts: Workout[];
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userID: Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  duration: number;
  @Prop({ type: Date })
  createdAt: Date;
}
export const WorkoutLogSchema = SchemaFactory.createForClass(WorkoutLog);
