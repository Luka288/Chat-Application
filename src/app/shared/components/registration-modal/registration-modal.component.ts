import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { registartionData } from '../../interfaces/reg.interface';

@Component({
  selector: 'app-registration-modal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registration-modal.component.html',
  styleUrl: './registration-modal.component.scss',
})
export class RegistrationModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() emitRegisterData = new EventEmitter<registartionData>();

  registrationForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    username: new FormControl('', {
      validators: [Validators.required],
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
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const regData: registartionData = {
      email: this.registrationForm.controls.email.value,
      password: this.registrationForm.controls.password.value,
      username: this.registrationForm.controls.username.value,
    };

    this.emitRegisterData.emit(regData);
    this.registrationForm.reset();
  }
}
