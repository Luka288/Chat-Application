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
  updateDoc,
} from '@angular/fire/firestore';
import { chatMessage } from '../interfaces/chat.interface';
import { arrayUnion, orderBy, query } from 'firebase/firestore';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly auth = inject(Auth);
  private readonly Fire = inject(Firestore);

  async sendMessage(data: Message) {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }

    const messagesCollection = collection(
      this.Fire,
      `${data.chatLocation()}/${data.chat_id}/messages`
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

  getMessages(chat_id: string) {
    const chatLoc = chat_id === 'general' ? 'generalChat' : 'chats';
    const id = chat_id === 'general' ? 'general' : chat_id;

    const messagesCollection = collection(
      this.Fire,
      `${chatLoc}/${id}/messages`
    );

    console.log(`${chatLoc}/${id}/messages`);

    const sortedMessages = query(messagesCollection, orderBy('time', 'asc'));

    return collectionData(sortedMessages, { idField: 'id' });
  }

  async createChat(chatName: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.Fire, `users/${user.uid}`);
    const chatDoc = doc(this.Fire, `chats/${chatName}`);

    const chatData = {
      chatName: chatName,
      chatId: chatName,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      members: [],
    };

    try {
      await setDoc(chatDoc, chatData);

      await updateDoc(userRef, {
        createdChats: arrayUnion({
          chatId: chatName,
          chatName,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
