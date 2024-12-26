import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';

@Component({
  selector: 'app-vacation-day-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacation-day-cell.component.html',
  styleUrl: './vacation-day-cell.component.scss',
})
export class VacationDayCellComponent {
  @Input() day!: CalendarMonthViewDay;
}
