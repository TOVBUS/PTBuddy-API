import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './routine.entity';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
  ) {}

  async create(routine: Partial<Routine>): Promise<Routine> {
    return this.routineRepository.save(routine);
  }

  async createBulk(routines: Partial<Routine>[]): Promise<Routine[]> {
    return this.routineRepository.save(routines);
  }

  async findAll(): Promise<Routine[]> {
    return this.routineRepository.find();
  }
}
