import { Injectable } from '@angular/core';
import { Vacation } from '../models/Vacation';
import { Activity } from '../models/Activity';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
  constructor() {}

  validateVacationForm(params: {
    startDate: Date;
    endDate: Date;
    remainingLeaveDays: number;
    userActivities: Activity[];
    userVacations: Vacation[];
  }): void {
    const startDate = params.startDate;
    const endDate = params.endDate;

    if (startDate < new Date() || endDate < new Date()) {
      throw new Error('Dates must be in the future');
    }

    if (endDate < startDate) {
      throw new Error('End date must be after start date');
    }

    for (const activity of params.userActivities) {
      const activityDate = new Date(activity.date);
      if (activityDate >= startDate && activityDate <= endDate) {
        throw new Error('There are activities planned for the selected period');
      }
    }

    for (const vacation of params.userVacations) {
      const vacationStartDate = new Date(vacation.startDate);
      const vacationEndDate = new Date(vacation.endDate);
      if (startDate >= vacationStartDate && startDate <= vacationEndDate) {
        throw new Error('There are vacations planned for the selected period');
      }
      if (endDate >= vacationStartDate && endDate <= vacationEndDate) {
        throw new Error('There are vacations planned for the selected period');
      }
    }

    const vacationDays: number = this.getVacationDays({ startDate, endDate });

    if (vacationDays > params.remainingLeaveDays) {
      throw new Error('Not enough leave days');
    }
  }

  getVacationDays(params: { startDate: Date; endDate: Date }): number {
    let days = 0;
    let currentDate = new Date(params.startDate);
    while (currentDate <= params.endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }
}
