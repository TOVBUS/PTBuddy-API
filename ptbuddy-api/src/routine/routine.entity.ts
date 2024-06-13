import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'routines' })
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  week: number;

  @Column()
  day: string;

  @Column()
  exerciseArea: string;

  @Column()
  exerciseNameEN: string;

  @Column()
  exerciseNameKR: string;

  @Column()
  reps: string;

  @Column()
  sets: string;

  @Column()
  weight: string;

  @Column()
  duration: string;
}
