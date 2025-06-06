import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
} from '@angular/core';
import { Invitation } from '../../interfaces/invite.interface';
import { inviteUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-notification-modal',
  imports: [],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.scss',
})
export class NotificationModalComponent {
  @Input() data: Invitation[] | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() emitAccept = new EventEmitter<Invitation>();
  @Output() emitDecline = new EventEmitter<Invitation>();
}
