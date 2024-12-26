import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';

@Component({
  selector: 'app-work-day-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-day-cell.component.html',
  styleUrl: './work-day-cell.component.scss',
})
export class WorkDayCellComponent {
  @Input() day!: CalendarMonthViewDay;
}
