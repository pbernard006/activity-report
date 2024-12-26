import { Component, computed, inject, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UsersStore } from '../../store/users.store';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
  });
  store = inject(UsersStore);
  users = computed(() => this.store.users());

  constructor(private router: Router, protected userService: UserService) {}

  ngOnInit(): void {
    if (this.users().length === 0) {
      this.userService.getUsers().subscribe({
        next: (users: User[]) => {
          this.store.setUsers(users);
        },
      });
    }
  }

  onSubmit(): void {
    this.store.setCurrentUserFlagToTrue(
      Number(this.loginForm.get('username')?.value)
    );
    this.router.navigate(['/']);
  }
}
