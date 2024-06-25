import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Types } from 'mongoose';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/roles.decorator';
import { Roles } from '../roles/roles.enum';

@Controller({ version: '1', path: 'workouts' })
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.create(createWorkoutDto);
  }

  @Get()
  findAll() {
    return this.workoutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.workoutsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  remove(@Param('id') id: Types.ObjectId) {
    return this.workoutsService.remove(id);
  }
}
