import { Component, inject, Input, Signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { UsersStore } from '../../store/users.store';
import { MatDialog } from '@angular/material/dialog';
import { AddVacationComponent } from '../dialogs/add-vacation/add-vacation.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() currentUser!: Signal<User>;

  readonly store = inject(UsersStore);
  readonly dialog = inject(MatDialog);
  constructor(private router: Router) {}

  logout(): void {
    this.store.logoutUser();
    this.router.navigate(['/login']);
  }

  openAddVacationDialog(): void {
    this.dialog.open(AddVacationComponent, {
      data: { currentUser: this.currentUser },
    });
  }
}
