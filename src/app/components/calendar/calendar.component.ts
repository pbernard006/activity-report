import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  CalendarEvent,
  CalendarModule,
  CalendarMonthViewDay,
} from 'angular-calendar';
import { DayDetailComponent } from '../dialogs/day-detail/day-detail.component';
import { User } from '../../models/User';
import { toCalendarEvents } from '../../utils/calendar-event-mapper.util';
import { VACATION_EVENT_TITLE } from '../../config/constants';
import { VacationDayCellComponent } from '../vacation-day-cell/vacation-day-cell.component';
import { WorkDayCellComponent } from '../work-day-cell/work-day-cell.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CalendarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    VacationDayCellComponent,
    WorkDayCellComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  @Input() currentUser!: Signal<User>;
  viewDate: Date = new Date();
  //events: CalendarEvent[] = [];
  events: Signal<CalendarEvent[]> = computed(() =>
    toCalendarEvents(
      this.currentUser().vacationList,
      this.currentUser().activities
    )
  );

  readonly dialog = inject(MatDialog);

  goToPreviousMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.viewDate = newDate;
  }

  goToNextMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.viewDate = newDate;
  }

  openDayDetailDialog(event: { day: CalendarMonthViewDay }): void {
    if (
      event.day.events.length > 0 &&
      event.day.events[0].title === VACATION_EVENT_TITLE
    ) {
      return;
    }
    this.dialog.open(DayDetailComponent, {
      data: { currentUser: this.currentUser, date: event.day.date },
    });
  }
}
