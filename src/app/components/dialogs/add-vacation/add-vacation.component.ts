import { Component, computed, inject, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/User';
import { Vacation } from '../../../models/Vacation';
import { MAX_VACATION_DAYS } from '../../../config/constants';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { VacationService } from '../../../services/vacation.service';
import { UsersStore } from '../../../store/users.store';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-vacation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './add-vacation.component.html',
  styleUrl: './add-vacation.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AddVacationComponent {
  readonly dialogRef = inject(MatDialogRef<AddVacationComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly currentUser: Signal<User> = computed(() => this.data.currentUser());
  remainingLeaveDays: Signal<number> = computed(() =>
    this.getRemainingLeaveDays(this.currentUser().vacationList)
  );

  vacationForm = new FormGroup({
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
  });

  private errorSnackbar = inject(MatSnackBar);
  private store = inject(UsersStore);
  constructor(private vacationService: VacationService) {}

  private getRemainingLeaveDays(vacationList: Vacation[]): number {
    const usedVacationDays = vacationList.reduce(
      (acc, vacation) => acc + vacation.vacationDaysCount,
      0
    );
    return MAX_VACATION_DAYS - usedVacationDays;
  }

  onSubmit(): void {
    try {
      this.vacationService.validateVacationForm({
        startDate: this.vacationForm.get('startDate')?.value!,
        endDate: this.vacationForm.get('endDate')?.value!,
        remainingLeaveDays: this.remainingLeaveDays(),
        userActivities: this.currentUser().activities,
        userVacations: this.currentUser().vacationList,
      });

      const vacation: Vacation = {
        startDate: this.vacationForm.get('startDate')?.value!,
        endDate: this.vacationForm.get('endDate')?.value!,
        vacationDaysCount: this.vacationService.getVacationDays({
          startDate: this.vacationForm.get('startDate')?.value!,
          endDate: this.vacationForm.get('endDate')?.value!,
        }),
      };
      this.store.addVacation(vacation);
      this.resetForm();
    } catch (error: any) {
      this.errorSnackbar.open(`Error: ${error.message}`, 'Close', {
        duration: 3000,
      });
    }
  }

  removeVacation(index: number): void {
    this.store.removeVacation(index);
  }

  private resetForm(): void {
    this.vacationForm.reset();
  }
}
