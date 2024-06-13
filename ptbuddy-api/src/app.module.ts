import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActivityModule } from './activity/activity.module';
import { RoutineModule } from './routine/routine.module';
import { OpenaiModule } from './openai/openai.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ActivityModule,
    DatabaseModule,
    RoutineModule,
    OpenaiModule,
  ],
})
export class AppModule {}
