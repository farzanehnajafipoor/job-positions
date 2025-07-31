import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('skill')
@Unique(['name'])
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => JobEntity, (job) => job.skills)
  jobs: JobEntity[];
}
