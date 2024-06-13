import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  findAll(): Promise<Activity[]> {
    return this.activityRepository.find();
  }

  create(activity: Activity): Promise<Activity> {
    return this.activityRepository.save(activity);
  }
}
