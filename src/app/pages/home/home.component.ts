import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UsersStore } from '../../store/users.store';
import { User } from '../../models/User';
import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CalendarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  store = inject(UsersStore);
  currentUser!: Signal<User>;

  ngOnInit(): void {
    this.currentUser = computed(
      () => this.store.users().find((user) => user.isCurrentUser === true)!
    );
  }
}
