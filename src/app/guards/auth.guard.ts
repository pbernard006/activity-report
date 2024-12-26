import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersStore } from '../store/users.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '../models/User';
import { catchError, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(UsersStore);
  const router = inject(Router);

  return toObservable(store.users).pipe(
    map((users: User[]) => {
      const isCurrentUser = users.some((user) => user.isCurrentUser);
      if (isCurrentUser) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return [false];
    })
  );
};
