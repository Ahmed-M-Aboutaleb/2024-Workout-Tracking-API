import { Injectable } from '@nestjs/common';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WorkoutLog } from './entities/workout-log.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class WorkoutLogsService {
  constructor(
    @InjectModel(WorkoutLog.name) private workoutLogModel: Model<WorkoutLog>,
  ) {}
  async create(createWorkoutLogDto: CreateWorkoutLogDto): Promise<WorkoutLog> {
    const createdWorkoutLog = new this.workoutLogModel(createWorkoutLogDto);
    createdWorkoutLog._id = new Types.ObjectId();
    return await createdWorkoutLog.save();
  }

  async findAll(): Promise<WorkoutLog[]> {
    const workoutLogs = await this.workoutLogModel.find().exec();
    return workoutLogs;
  }

  async findOne(id: Types.ObjectId): Promise<WorkoutLog> {
    const workoutLog = await this.workoutLogModel.findById(id).exec();
    return workoutLog;
  }

  async update(
    id: Types.ObjectId,
    updateWorkoutLogDto: UpdateWorkoutLogDto,
  ): Promise<WorkoutLog> {
    const updatedWorkoutLog = await this.workoutLogModel.findByIdAndUpdate(
      id,
      updateWorkoutLogDto,
      { new: true },
    );
    return updatedWorkoutLog;
  }

  async delete(id: Types.ObjectId): Promise<WorkoutLog> {
    return await this.workoutLogModel.findByIdAndDelete(id).exec();
  }
}
