import { User } from '../models/User';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Vacation } from '../models/Vacation';
import { Activity } from '../models/Activity';

type UsersState = {
  users: User[];
};

const initialState: UsersState = {
  users: [],
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUsers(users: User[]) {
      patchState(store, { users });
    },
    setCurrentUserFlagToTrue(userId: number) {
      patchState(store, (state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, isCurrentUser: true }
            : { ...user, isCurrentUser: false }
        ),
      }));
    },
    logoutUser() {
      patchState(store, (state) => ({
        users: state.users.map((user) =>
          user.isCurrentUser ? { ...user, isCurrentUser: false } : user
        ),
      }));
    },
    addVacation(vacation: Vacation) {
      patchState(store, (state) => ({
        users: state.users.map((user) =>
          user.isCurrentUser
            ? { ...user, vacationList: [...user.vacationList, vacation] }
            : user
        ),
      }));
    },
    removeVacation(index: number) {
      patchState(store, (state) => ({
        users: state.users.map((user) =>
          user.isCurrentUser
            ? {
                ...user,
                vacationList: user.vacationList.filter((_, i) => i !== index),
              }
            : user
        ),
      }));
    },
    addActivity(activity: Activity) {
      patchState(store, (state) => ({
        users: state.users.map((user) =>
          user.isCurrentUser
            ? {
                ...user,
                activities: [
                  ...user.activities,
                  {
                    id: user.activities.length + 1,
                    project: activity.project,
                    date: activity.date,
                    duration: activity.duration,
                  },
                ],
              }
            : user
        ),
      }));
    },
    removeActivity(activityId: number) {
      patchState(store, (state) => ({
        users: state.users.map((user) =>
          user.isCurrentUser
            ? {
                ...user,
                activities: user.activities.filter(
                  (activity) => activity.id !== activityId
                ),
              }
            : user
        ),
      }));
    },
  }))
);
