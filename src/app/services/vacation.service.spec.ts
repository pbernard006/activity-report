import { TestBed } from '@angular/core/testing';
import { VacationService } from './vacation.service';
import { MAX_VACATION_DAYS, WORKING_HOURS_PER_DAY } from '../config/constants';
import { Activity } from '../models/Activity';
import { Vacation } from '../models/Vacation';

describe('VacationService', () => {
  let vacationService: VacationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    vacationService = TestBed.inject(VacationService);
  });

  it('should throw an error if start or end date is in the past', () => {
    expect(() => {
      vacationService.validateVacationForm({
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-02'),
        remainingLeaveDays: MAX_VACATION_DAYS,
        userActivities: [],
        userVacations: [],
      });
    }).toThrowError('Dates must be in the future');
  });

  it('should throw an error if end date is before start date', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);

    expect(() => {
      vacationService.validateVacationForm({
        startDate: startDate,
        endDate: endDate,
        remainingLeaveDays: MAX_VACATION_DAYS,
        userActivities: [],
        userVacations: [],
      });
    }).toThrowError('End date must be after start date');
  });

  it('should throw an error if there are activities planned in the selected period', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    const activityDate = new Date();
    activityDate.setDate(activityDate.getDate() + 7);

    const activities: Activity[] = [
      {
        id: 1,
        project: { id: 1, name: 'Project 1', color: '#000000' },
        date: activityDate,
        duration: WORKING_HOURS_PER_DAY,
      },
    ];

    expect(() => {
      vacationService.validateVacationForm({
        startDate: startDate,
        endDate: endDate,
        remainingLeaveDays: 5,
        userActivities: activities,
        userVacations: [],
      });
    }).toThrowError('There are activities planned for the selected period');
  });

  it('should throw an error if there are vacations planned in the selected period', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    const vacationStartDate = new Date();
    vacationStartDate.setDate(vacationStartDate.getDate() + 3);

    const vacationEndDate = new Date();
    vacationEndDate.setDate(vacationEndDate.getDate() + 5);

    const vacations: Vacation[] = [
      {
        startDate: vacationStartDate,
        endDate: vacationEndDate,
        vacationDaysCount:
          (vacationEndDate.getTime() - vacationStartDate.getTime()) /
          (1000 * 60 * 60 * 24),
      },
    ];

    expect(() => {
      vacationService.validateVacationForm({
        startDate: startDate,
        endDate: endDate,
        remainingLeaveDays: MAX_VACATION_DAYS,
        userActivities: [],
        userVacations: vacations,
      });
    }).toThrowError('There are vacations planned for the selected period');
  });

  it('should throw an error if vacation days exceed remaining leave days', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    expect(() => {
      vacationService.validateVacationForm({
        startDate: startDate,
        endDate: endDate,
        remainingLeaveDays: MAX_VACATION_DAYS - MAX_VACATION_DAYS,
        userActivities: [],
        userVacations: [],
      });
    }).toThrowError('Not enough leave days');
  });

  it('should not throw an error for valid vacation data', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    expect(() => {
      vacationService.validateVacationForm({
        startDate: startDate,
        endDate: endDate,
        remainingLeaveDays: MAX_VACATION_DAYS,
        userActivities: [],
        userVacations: [],
      });
    }).not.toThrow();
  });
});
