import { Component, EventEmitter, Input, Output } from '@angular/core';
import { inviteUser, publicUser } from '../../interfaces/user.interface';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { miniChat } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-user-search',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss',
})
export class UserSearchComponent {
  @Input() results: publicUser[] | null = null;
  @Input() currentChatData!: miniChat;

  @Output() close = new EventEmitter<void>();
  @Output() emitSearch = new EventEmitter<string>();
  @Output() emitInvite = new EventEmitter<inviteUser>();

  ngOnInit(): void {
    this.results = null;
    this.searchForm.controls.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((res) => {
        this.sendSearch(res);
      });
  }

  searchForm = new FormGroup({
    searchControl: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  sendInvite(userData: publicUser) {
    this.emitInvite.emit({
      userdata: userData,
      currentData: this.currentChatData,
    });
  }

  sendSearch(username: string) {
    if (
      this.searchForm.invalid ||
      this.searchForm.controls.searchControl.value === ''
    ) {
      this.results = null;
      return;
    }

    this.emitSearch.emit(username);
  }

  closeModal() {
    this.results = null;
    this.close.emit();
    this.searchForm.reset();
  }
}
