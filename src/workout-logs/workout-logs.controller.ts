import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Workout Logs')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'workout-logs',
})
export class WorkoutLogsController {
  constructor(private readonly workoutLogsService: WorkoutLogsService) {}

  @Post()
  create(@Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutLogsService.create(createWorkoutLogDto);
  }

  @Get()
  findAll() {
    return this.workoutLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.workoutLogsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateWorkoutLogDto: UpdateWorkoutLogDto,
  ) {
    return this.workoutLogsService.update(id, updateWorkoutLogDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Types.ObjectId) {
    return this.workoutLogsService.delete(id);
  }
}
