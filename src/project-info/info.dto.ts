export class projectInfoDto {
  links: Link[];
  meeting_link: string;
  project_manager_email: string;
  project_manager_name: string;
  project_manager_phone: string;
  completion_percentage: number;
  note: string;
  project: number;
}

interface Link {
  url: string;
  description: string;
}
