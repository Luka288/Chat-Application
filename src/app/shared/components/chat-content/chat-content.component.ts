import { Component, Input } from '@angular/core';
import { chatMessage } from '../../interfaces/chats.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-content',
  imports: [CommonModule],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss',
})
export class ChatContentComponent {
  @Input() chatContent: chatMessage | null = null;
}
