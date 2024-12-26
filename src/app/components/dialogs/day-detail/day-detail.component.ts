import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Project } from '../../../models/Project';
import { ActivityService } from '../../../services/activity.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/User';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersStore } from '../../../store/users.store';
import { Activity } from '../../../models/Activity';

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './day-detail.component.html',
  styleUrl: './day-detail.component.scss',
})
export class DayDetailComponent implements OnInit {
  allProjects = signal<Project[]>([]);
  readonly projectsList: Signal<Project[]> = computed(() => {
    return this.activityService.getAvailableProjectsByActiviyListAndDate({
      projects: this.allProjects(),
      date: this.activityDay,
      activities: this.currentUser().activities,
    });
  });

  readonly data = inject(MAT_DIALOG_DATA);
  readonly currentUser: Signal<User> = computed(() => this.data.currentUser());
  readonly userActivitiesForDay: Signal<Activity[]> = computed(() =>
    this.getUserActivitiesForDay(this.currentUser().activities)
  );
  readonly activityDay: Date = this.data.date;

  addActivityForm = new FormGroup({
    projectName: new FormControl('', Validators.required),
    duration: new FormControl(null, Validators.required),
  });

  private errorSnackbar = inject(MatSnackBar);
  private store = inject(UsersStore);
  constructor(protected activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.getProjects().subscribe({
      next: (allProjects: Project[]) => {
        this.allProjects.set(allProjects);
      },
    });
  }

  onSubmit(): void {
    try {
      this.activityService.validateActivityForm({
        date: this.activityDay,
        duration: Number(this.addActivityForm.get('duration')!.value),
        projectId: Number(this.addActivityForm.get('projectName')!.value),
        user: this.currentUser(),
      });

      const project: Project = this.projectsList().find(
        (project) =>
          project.id === Number(this.addActivityForm.get('projectName')!.value)
      )!;

      const activity: Activity = {
        project: project,
        date: this.activityDay,
        duration: Number(this.addActivityForm.get('duration')!.value),
      };

      this.store.addActivity(activity);
      this.resetForm();
    } catch (error: any) {
      this.errorSnackbar.open(`Error: ${error.message}`, 'Close', {
        duration: 3000,
      });
    }
  }

  removeActivity(id: number): void {
    this.store.removeActivity(id);
  }

  private getUserActivitiesForDay(userActivities: Activity[]): Activity[] {
    return userActivities.filter(
      (activity) => activity.date.getTime() === this.activityDay.getTime()
    );
  }

  private resetForm(): void {
    this.addActivityForm.reset();
  }
}
