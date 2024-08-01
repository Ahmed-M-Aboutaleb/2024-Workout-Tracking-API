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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Workouts')
@ApiBearerAuth()
@Controller({ version: '1', path: 'workouts' })
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  delete(@Param('id') id: Types.ObjectId) {
    return this.workoutsService.delete(id);
  }
}
