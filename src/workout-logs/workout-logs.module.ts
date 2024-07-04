import { Module } from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import { WorkoutLogsController } from './workout-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutLog, WorkoutLogSchema } from './entities/workout-log.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkoutLog.name, schema: WorkoutLogSchema },
    ]),
  ],
  controllers: [WorkoutLogsController],
  providers: [WorkoutLogsService],
})
export class WorkoutLogsModule {}
