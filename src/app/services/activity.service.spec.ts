import { TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';
import { User } from '../models/User';
import { WORKING_HOURS_PER_DAY } from '../config/constants';
import { provideHttpClient } from '@angular/common/http';

describe('ActivityService', () => {
  let activityService: ActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    activityService = TestBed.inject(ActivityService);
  });

  it("should throw an error if the total duration of the day's activities exceeds the available hours", () => {
    const date = new Date();
    const user: User = {
      id: 1,
      username: 'John Doe',
      isCurrentUser: true,
      activities: [],
      vacationList: [],
    };

    expect(() => {
      activityService.validateActivityForm({
        date: date,
        duration: WORKING_HOURS_PER_DAY + 1,
        projectId: 1,
        user: user,
      });
    }).toThrowError(
      `The total duration of the day's activities must not exceed ${WORKING_HOURS_PER_DAY} hours`
    );
  });

  it('should throw an error if the user has already an activity for the same project on the same day', () => {
    const date = new Date();
    const user: User = {
      id: 1,
      username: 'John Doe',
      isCurrentUser: true,
      activities: [
        {
          id: 1,
          date: new Date(),
          duration: 4,
          project: { id: 1, name: 'Project A', color: '#000000' },
        },
      ],
      vacationList: [],
    };

    expect(() => {
      activityService.validateActivityForm({
        date: date,
        duration: 2,
        projectId: 1,
        user: user,
      });
    }).toThrowError(
      'You cannot have two activities on the same project in the same day'
    );
  });

  it('should not throw an error if the user has valid activities for the day', () => {
    const date = new Date();
    const user: User = {
      id: 1,
      username: 'John Doe',
      isCurrentUser: true,
      activities: [],
      vacationList: [],
    };

    expect(() => {
      activityService.validateActivityForm({
        date: date,
        duration: 3,
        projectId: 2,
        user: user,
      });
    }).not.toThrow();
  });
});
