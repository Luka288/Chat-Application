import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-chat-create-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-create-modal.component.html',
  styleUrl: './chat-create-modal.component.scss',
})
export class ChatCreateModalComponent {
  @Output() emitChatName = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  chatFormGroup = new FormGroup({
    chatNameControl: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  sendData() {
    if (this.chatFormGroup.controls.chatNameControl.invalid) {
      console.log('Invalid chat name');
      return;
    }

    this.emitChatName.emit(this.chatFormGroup.controls.chatNameControl.value);

    this.chatFormGroup.reset();
  }
}
