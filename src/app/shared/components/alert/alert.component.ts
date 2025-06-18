import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertData } from '../../interfaces/alert.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Output() closeAlert = new EventEmitter<void>();
  @Input() alertData: AlertData | null = null;
  @Input() isVisible: boolean = true;
}
