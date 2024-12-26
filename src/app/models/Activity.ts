import { Project } from './Project';

export interface Activity {
  id?: number;
  project: Project;
  date: Date;
  duration: number;
}
