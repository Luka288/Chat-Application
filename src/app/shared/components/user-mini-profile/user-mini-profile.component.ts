import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { privateUser } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-mini-profile',
  imports: [CommonModule],
  templateUrl: './user-mini-profile.component.html',
  styleUrl: './user-mini-profile.component.scss',
})
export class UserMiniProfileComponent {
  readonly authService = inject(AuthService);

  @Input() user: privateUser | null = null;
}
