import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { User } from '../models/User';

describe('UserService', () => {
  let userService: UserService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    userService = TestBed.inject(UserService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should fetch users from the JSON file', () => {
    const USERS_JSON_PATH = 'data/users.json';
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'Mathieu',
        isCurrentUser: false,
        activities: [],
        vacationList: [],
      },
      {
        id: 2,
        username: 'Bob',
        isCurrentUser: false,
        activities: [],
        vacationList: [],
      },
      {
        id: 3,
        username: 'Alice',
        isCurrentUser: false,
        activities: [],
        vacationList: [],
      },
    ];

    userService.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(3);
    });

    const req = httpTesting.expectOne(USERS_JSON_PATH);
    req.flush(mockUsers);
  });
});
