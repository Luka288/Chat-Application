import { Timestamp } from '@angular/fire/firestore';
import { chatMessage } from '../interfaces/chat.interface';

export class Message {
  constructor(
    public sender: string,
    public user_id: string,
    public text: string,
    public time: Date | string,
    public chat_id: string
  ) {}

  public chatLocation(): string {
    return this.chat_id === 'general' ? 'generalChat' : 'chats';
  }

  static fromData(data: chatMessage) {
    return new Message(
      data.sender,
      data.user_id,
      data.text,
      data.time instanceof Timestamp ? data.time.toDate() : data.time,
      data.chat_id
    );
  }
}
