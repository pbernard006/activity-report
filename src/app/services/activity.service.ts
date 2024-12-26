import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/Project';
import { map, Observable } from 'rxjs';
import { Activity } from '../models/Activity';
import { User } from '../models/User';
import { WORKING_HOURS_PER_DAY } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly PROJECTS_JSON_PATH = 'data/projects.json';
  constructor(protected http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.PROJECTS_JSON_PATH);
  }

  getAvailableProjectsByActiviyListAndDate(params: {
    projects: Project[];
    date: Date;
    activities: Activity[];
  }): Project[] {
    return params.projects.filter((project) => {
      return !params.activities.some((activity) => {
        return (
          new Date(activity.date).toDateString() ===
            params.date.toDateString() && activity.project.id === project.id
        );
      });
    });
  }

  validateActivityForm(params: {
    date: Date;
    duration: number;
    projectId: number;
    user: User;
  }): void {
    if (
      this.getTotalActivityDuration(params.date, params.user.activities) +
        params.duration >
      WORKING_HOURS_PER_DAY
    ) {
      throw new Error(
        `The total duration of the day's activities must not exceed ${WORKING_HOURS_PER_DAY} hours`
      );
    }

    const userActivitiesForDay = params.user.activities.filter(
      (activity) =>
        new Date(activity.date).toDateString() === params.date.toDateString()
    );

    if (
      userActivitiesForDay.some(
        (activity) => activity.project.id === params.projectId
      )
    ) {
      throw new Error(
        'You cannot have two activities on the same project in the same day'
      );
    }
  }

  private getTotalActivityDuration(date: Date, activities: Activity[]): number {
    return activities
      .filter(
        (activity) =>
          new Date(activity.date).toDateString() === date.toDateString()
      )
      .reduce((acc, activity) => acc + activity.duration, 0);
  }
}
