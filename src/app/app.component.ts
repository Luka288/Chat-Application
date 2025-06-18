import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/alert/alert.component';
import { CustomAlertsService } from './shared/services/custom-alerts.service';
import { CommonModule } from '@angular/common';
import { AlertData } from './shared/interfaces/alert.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly customAlertService = inject(CustomAlertsService);
  alertData$ = this.customAlertService.alert$;
}
