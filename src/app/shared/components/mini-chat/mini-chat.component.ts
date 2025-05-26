import { Component, EventEmitter, Input, Output } from '@angular/core';
import { miniChat } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-mini-chat',
  imports: [],
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.scss',
})
export class MiniChatComponent {
  @Input() chatData: miniChat | null = null;
  @Output() chatSelected = new EventEmitter<miniChat>();

  setChat(_id: string, name: string) {
    console.log({ chatID: _id, chatName: name });
    this.chatSelected.emit({
      chatId: _id,
      chatName: name,
    });
  }
}
