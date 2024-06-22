import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type SetType = 'Failure' | 'Warm Up' | 'Drop' | 'Normal';
export type WeightUnit = 'kg' | 'lbs';

export type SetDocument = HydratedDocument<Set>;
@Schema({ collection: 'sets', timestamps: true })
export class Set {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ default: 'Normal' })
  type: SetType;
  @Prop({ default: 0 })
  reps: number;
  @Prop({ default: 0 })
  weight: number;
  @Prop({ default: 'kg' })
  weightUnit: WeightUnit;
  @Prop({ default: false })
  isDone: boolean;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Set', default: null })
  previousSet: SetDocument;
}

export const SetSchema = SchemaFactory.createForClass(Set);
