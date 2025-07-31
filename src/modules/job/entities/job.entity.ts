import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { SkillEntity } from './skill.entity';

@Entity('job')
@Unique(['jobKey'])
export class JobEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  jobKey!: string;

  @Column()
  title!: string;

  @ManyToOne(() => CompanyEntity, (company) => company.jobs, { eager: true })
  company!: CompanyEntity;

  @Column({ nullable: true })
  jobType?: string;

  @Column({ nullable: true, type: 'int' })
  salaryMin?: number;

  @Column({ nullable: true, type: 'int' })
  salaryMax?: number;

  @Column({ nullable: true })
  salaryCurrency?: string;

  @Column({ nullable: true })
  salaryRangeStr?: string;

  @Column({ nullable: true, type: 'int' })
  experience?: number;

  @Column({ type: 'timestamptz' })
  postedDate!: Date;

  @ManyToMany(() => SkillEntity, (skill) => skill.jobs, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  skills!: SkillEntity[];
}
