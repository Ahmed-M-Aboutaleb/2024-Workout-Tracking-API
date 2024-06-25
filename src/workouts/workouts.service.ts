import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workout } from './entities/workout.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<Workout>,
  ) {}
  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const createdWorkout = new this.workoutModel(createWorkoutDto);
    createdWorkout._id = new Types.ObjectId();
    return await createdWorkout.save();
  }

  async findAll(): Promise<Workout[]> {
    const workouts = await this.workoutModel.find().exec();
    return workouts;
  }

  async findOne(id: Types.ObjectId): Promise<Workout> {
    const workout = await this.workoutModel.findById(id).exec();
    return workout;
  }

  async findOneByName(name: string): Promise<Workout> {
    const workout = await this.workoutModel.findOne({ name: name }).exec();
    return workout;
  }

  async update(
    id: Types.ObjectId,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<Workout> {
    const updatedWorkout = await this.workoutModel
      .findByIdAndUpdate(id, updateWorkoutDto, { new: true })
      .exec();
    return updatedWorkout;
  }

  async remove(id: Types.ObjectId): Promise<Workout> {
    return await this.workoutModel.findByIdAndDelete(id).exec();
  }
}
