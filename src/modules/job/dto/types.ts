import { CompanyEntity } from '../entities/company.entity';

interface JobLocation {
  city: string;
  state: string;
  remote: boolean;
}

interface JobCompensation {
  min: number;
  max: number;
  currency: string;
}

interface JobEmployer {
  companyName: string;
  website: string;
}

interface JobRequirements {
  experience: number;
  technologies: string[];
}

interface StructureBItem {
  position: string;
  location: JobLocation;
  compensation: JobCompensation;
  employer: JobEmployer;
  requirements: JobRequirements;
  datePosted: string;
}

export interface StructureBItems {
  data?: {
    jobsList?: Record<string, StructureBItem>;
  };
}

interface company {
  name: string;
  industry: string;
}

interface details {
  location: string;
  type: string;
  salaryRange: string;
}

interface StructureAItem {
  jobId: string;
  title: string;
  details: details;
  company: company;
  skills: string[];
  postedDate: string;
}

export interface StructureAItems {
  jobs?: StructureAItem[];
}

export interface CompanyDto {
  name: string;
  industry?: string;
  website?: string;
  city?: string;
  state?: string;
  remote?: boolean;
  fullAddress?: string;
}

export interface JobDto {
  jobKey: string;
  title: string;
  company: CompanyEntity;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryRangeStr?: string;
  experience?: number;
  postedDate: Date;
  skills: string[];
  city?: string;
  state?: string;
  remote?: boolean;
  fullAddress?: string;
}
