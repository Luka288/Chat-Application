import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly authService = inject(AuthService);

  ngOnInit(): void {
    // this.authService.currUser().subscribe(console.log);
  }
}
