import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { chatMessage } from '../interfaces/chat.interface';
import { orderBy, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly auth = inject(Auth);
  private readonly Fire = inject(Firestore);

  async sendMessage(data: chatMessage) {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }

    const messagesCollection = collection(
      this.Fire,
      `generalChat/${data.chat_id}/messages`
    );

    try {
      await addDoc(messagesCollection, {
        sender: data.sender,
        user_id: data.user_id,
        text: data.text,
        time: data.time,
        chat_id: data.chat_id,
      });
    } catch (error) {}
  }

  getMessages(id: string) {
    const messagesCollection = collection(
      this.Fire,
      `generalChat/${id}/messages`
    );
    const sortedMessages = query(messagesCollection, orderBy('time', 'asc'));

    return collectionData(sortedMessages, { idField: 'id' });
  }
}
