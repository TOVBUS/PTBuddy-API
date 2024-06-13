import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActivityModule } from './activity/activity.module';
import { RoutineModule } from './routine/routine.module';
import { OpenaiModule } from './openai/openai.module';
import { DatabaseModule } from './database/database.module';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ActivityModule,
    DatabaseModule,
    RoutineModule,
    OpenaiModule,
    MealModule,
  ],
})
export class AppModule {}
