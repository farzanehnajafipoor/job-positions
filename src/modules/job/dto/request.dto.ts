/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterJobsDto {
  @ApiPropertyOptional({
    example: 'developer',
    description: 'Filter by job name',
  })
  @IsOptional()
  @IsString()
  jobName?: string;

  @ApiPropertyOptional({
    example: 'Acme Corp',
    description: 'Filter by company name',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: 30000, description: 'Minimum salary filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minSalary?: number;

  @ApiPropertyOptional({
    example: 100000,
    description: 'Maximum salary filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxSalary?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
