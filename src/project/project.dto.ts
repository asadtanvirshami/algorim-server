interface Link {
  url: string;
  description: string;
}

export class ProjectCreationDto {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline:string;
  services: [{ name: '' }];
  userId: string;
  creadtedAt: Date;
  updatedAt: Date;
}

export class ProjectDto {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  serial_number: string;
  deadline: Date;
  start_date: Date;
  end_date: Date;
  approved: boolean;
  phase: string;
  userId: string;
  creadtedAt: Date;
  updatedAt: Date;
}

export class projectInfoDto {
  links: Link[];
  meeting_link: string;
  project_manager_email: string;
  project_manager_name: string;
  project_manager_phone: string;
  completion_percentage: number;
  note: string;
  project: string;
}

export class projectServiceDto {
  service_name: string;
  project: string;
}

export class UpdateProjectDto {
  project: any;
  services: any[];
  milestones: any[];
  details: any[];
  documents: any[];
  delete: {
    services: number[];
    milestones: number[];
    details: number[];
    documents: number[];
  };
}
