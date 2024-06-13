import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './activity/activity.module';
import { RoutineModule } from './routine/routine.module';
import { OpenaiModule } from './openai/openai.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ActivityModule, RoutineModule, OpenaiModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
