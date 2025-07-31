import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('JobController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET jobs without filters, default pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/jobs')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('limit', 10);
  });

  it('/GET jobs with filters and pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/jobs')
      .query({
        jobName: 'developer',
        minSalary: 30000,
        maxSalary: 100000,
        page: 2,
        limit: 5,
      })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page', 2);
    expect(response.body).toHaveProperty('limit', 5);

    for (const job of response.body.data) {
      expect(job.name.toLowerCase()).toContain('developer');
      expect(job.salaryMin).toBeGreaterThanOrEqual(30000);
      expect(job.salaryMax).toBeLessThanOrEqual(100000);
    }
  });
});
