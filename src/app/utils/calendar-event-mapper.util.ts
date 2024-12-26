import { CalendarEvent } from 'angular-calendar';
import { Activity } from '../models/Activity';
import { Vacation } from '../models/Vacation';
import { VACATION_EVENT_TITLE } from '../config/constants';

export function toCalendarEvents(
  vacationsList: Vacation[],
  activitiesList: Activity[]
): CalendarEvent[] {
  return [
    ...vacationsList.map(transformVacationToCalendarEvent),
    ...activitiesList.map(transformActivityToCalendarEvent),
  ];
}

function transformVacationToCalendarEvent(vacation: Vacation): CalendarEvent {
  return {
    start: vacation.startDate,
    end: vacation.endDate,
    title: VACATION_EVENT_TITLE,
    allDay: true,
  };
}

function transformActivityToCalendarEvent(activity: Activity): CalendarEvent {
  return {
    start: activity.date,
    end: new Date(activity.date.getTime() + activity.duration * 60000),
    title: activity.project.name,
    color: {
      primary: activity.project.color,
      secondary: activity.project.color,
    },
  };
}
