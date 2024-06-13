import { Module } from '@nestjs/common';
import { MealController } from './meal.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [MealController],
})
export class MealModule {}
