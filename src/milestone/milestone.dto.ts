export class MilestoneDto {
  id: number;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  isCompleted: boolean;
  project: number;
}
