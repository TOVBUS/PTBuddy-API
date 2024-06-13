import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  activityTitle: string;

  @Column()
  proTip: string;

  @Column()
  howTo: string;

  @Column()
  primaryMuscleGroups: string;

  @Column()
  muscleImageURL: string;

  @Column()
  equipment: string;

  @Column()
  videoURL: string;
}
