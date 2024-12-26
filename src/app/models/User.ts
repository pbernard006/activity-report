import { Activity } from './Activity';
import { Vacation } from './Vacation';

export interface User {
  id: number;
  username: string;
  isCurrentUser: boolean;
  activities: Activity[];
  vacationList: Vacation[];
}
