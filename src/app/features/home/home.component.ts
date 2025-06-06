import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistrationModalComponent } from '../../shared/components/registration-modal/registration-modal.component';
import {
  loginData,
  registartionData,
} from '../../shared/interfaces/reg.interface';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, FormsModule, RegistrationModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly authService = inject(AuthService);

  modalOpen = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
      nonNullable: true,
    }),
  });

  submitForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const userData: loginData = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    };

    this.authService.loginUser(userData);
    this.loginForm.reset();
  }

  registerUser(data: registartionData) {
    this.authService.registerUser(data);
  }
}
