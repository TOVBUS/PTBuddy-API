import { Controller, Get, Post, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Post()
  create(@Body() activity: Activity): Promise<Activity> {
    return this.activityService.create(activity);
  }
}
