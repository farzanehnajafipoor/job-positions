import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('company')
@Unique(['name'])
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  remote?: boolean;

  @Column({ nullable: true })
  fullAddress?: string;

  @OneToMany(() => JobEntity, (job) => job.company)
  jobs!: JobEntity[];
}
