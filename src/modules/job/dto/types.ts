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

interface JobItemB {
  position: string;
  location: JobLocation;
  compensation: JobCompensation;
  employer: JobEmployer;
  requirements: JobRequirements;
  datePosted: string;
}

export interface StructureBData {
  data?: {
    jobsList?: Record<string, JobItemB>;
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

interface JobItemA {
  jobId: string;
  title: string;
  details: details;
  company: company;
  skills: string[];
  postedDate: string;
}

export interface StructureAData {
  jobs?: JobItemA[];
}
