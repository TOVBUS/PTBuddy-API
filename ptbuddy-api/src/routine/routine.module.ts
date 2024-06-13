import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { Routine } from './routine.entity';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Routine]), OpenaiModule],
  providers: [RoutineService],
  controllers: [RoutineController],
})
export class RoutineModule {}
