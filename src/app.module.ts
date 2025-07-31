/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobEntity } from './modules/job/entities/job.entity';
import { CompanyEntity } from './modules/job/entities/company.entity';
import { SkillEntity } from './modules/job/entities/skill.entity';
import { DBConfig } from './config/env.validation';
import { JobModule } from './modules/job/job.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<DBConfig>) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get('DB_PORT') ?? '5432', 10),
        username: config.get('DB_USERNAME') ?? 'user',
        password: config.get('DB_PASSWORD') ?? 'password',
        database: config.get('DB_NAME') ?? 'mydb',
        entities: [JobEntity, CompanyEntity, SkillEntity],
        synchronize: true,
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    JobModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
