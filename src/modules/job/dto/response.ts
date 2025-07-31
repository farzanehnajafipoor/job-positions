// dto/job.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class JobDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  salaryMin?: number;

  @ApiProperty()
  salaryMax?: number;

  @ApiProperty()
  companyName: string;
}

export class PaginatedJobsDto {
  @ApiProperty({ type: [JobDto] })
  data: JobDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
