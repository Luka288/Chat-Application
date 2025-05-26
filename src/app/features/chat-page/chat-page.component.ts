import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserMiniProfileComponent } from '../../shared/components/user-mini-profile/user-mini-profile.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-page',
  imports: [
    RouterModule,
    UserMiniProfileComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent {
  readonly authService = inject(AuthService);

  messageControl = new FormControl('', [Validators.required]);

  currentUser = toSignal(this.authService.currentUser(), {
    initialValue: null,
  });

  ngOnInit(): void {}
}
