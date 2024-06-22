import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Types } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  _id: Types.ObjectId;
  createdAt: Date;
}
