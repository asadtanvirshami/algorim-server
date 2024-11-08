export class ProjectDto {
  id:number;
  title: string;
  description: string;
  budget: number;
  status: string;
  serial_number: string;
  deadline: Date;
  approved: boolean;
  userId:string;
}

export class projectInfoDto {
  slack: string;
  jira: string;
  trello: string;
  github: string;
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
