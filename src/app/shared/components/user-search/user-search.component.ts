import { Component, EventEmitter, Input, Output } from '@angular/core';
import { publicUser } from '../../interfaces/user.interface';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-search',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss',
})
export class UserSearchComponent {
  @Input() results: publicUser[] | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() emitSearch = new EventEmitter<string>();
  @Output() emitInvite = new EventEmitter<publicUser>();

  ngOnInit(): void {
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
    this.emitInvite.emit(userData);
  }

  sendSearch(username: string) {
    if (
      this.searchForm.invalid ||
      this.searchForm.controls.searchControl.value === ''
    ) {
      return;
    }

    this.emitSearch.emit(username);
  }
}
