import { TestBed } from '@angular/core/testing';
import { UsersStore } from './users.store';
import { User } from '../models/User';
import { Activity } from '../models/Activity';
import { Vacation } from '../models/Vacation';

describe('UsersStore', () => {
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(UsersStore);
  });

  it('should initialize with an empty users list', () => {
    expect(store.users().length).toBe(0);
  });

  it('should set users correctly', () => {
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
    ];

    store.setUsers(mockUsers);
    expect(store.users()).toEqual(mockUsers);
  });

  it('should set the currentUser flag correctly', () => {
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
    ];

    store.setUsers(mockUsers);

    store.setCurrentUserFlagToTrue(2);
    const currentUser = store.users().find((user: User) => user.id === 2);
    expect(currentUser?.isCurrentUser).toBe(true);
  });

  it('should log out the current user', () => {
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
        isCurrentUser: true,
        activities: [],
        vacationList: [],
      },
    ];

    store.setUsers(mockUsers);
    const currentUserId = store
      .users()
      .find((user: User) => user.isCurrentUser)?.id;
    store.logoutUser();
    const loggedOutUser = store
      .users()
      .find((user: User) => user.id === currentUserId);
    expect(loggedOutUser?.isCurrentUser).toBe(false);
  });

  it('should add a vacation for the current user', () => {
    const mockUser: User = {
      id: 1,
      username: 'Mathieu',
      isCurrentUser: true,
      activities: [],
      vacationList: [],
    };

    store.setUsers([mockUser]);

    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 4));
    const mockVacation: Vacation = {
      startDate: startDate,
      endDate: endDate,
      vacationDaysCount: endDate.getTime() - startDate.getTime(),
    };

    store.addVacation(mockVacation);
    const currentUser = store.users().find((user: User) => user.isCurrentUser);
    expect(currentUser?.vacationList.length).toBe(1);
  });

  it('should remove a vacation for the current user', () => {
    const mockUser: User = {
      id: 1,
      username: 'Mathieu',
      isCurrentUser: true,
      activities: [],
      vacationList: [
        {
          startDate: new Date(),
          endDate: new Date(),
          vacationDaysCount: 0,
        },
      ],
    };

    store.setUsers([mockUser]);

    store.removeVacation(0);
    const currentUser = store.users().find((user: User) => user.isCurrentUser);
    expect(currentUser?.vacationList.length).toBe(0);
  });

  it('should add an activity for the current user', () => {
    const mockUser: User = {
      id: 1,
      username: 'Mathieu',
      isCurrentUser: true,
      activities: [],
      vacationList: [],
    };

    store.setUsers([mockUser]);

    const mockActivity: Activity = {
      project: { id: 1, name: 'Project A', color: '#000000' },
      date: new Date(),
      duration: 4,
    };

    store.addActivity(mockActivity);

    const currentUser = store.users().find((user: User) => user.isCurrentUser);
    expect(currentUser?.activities.length).toBe(1);
    expect(currentUser?.activities[0].project.name).toBe('Project A');
  });

  it('should remove an activity for the current user', () => {
    const mockUser: User = {
      id: 1,
      username: 'Mathieu',
      isCurrentUser: true,
      activities: [
        {
          id: 1,
          project: { id: 1, name: 'Project A', color: '#000000' },
          date: new Date(),
          duration: 4,
        },
      ],
      vacationList: [],
    };

    store.setUsers([mockUser]);

    store.removeActivity(1);
    const currentUser = store.users().find((user: User) => user.isCurrentUser);
    expect(currentUser?.activities.length).toBe(0);
  });
});
