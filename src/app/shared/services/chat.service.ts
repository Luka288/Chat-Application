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
import {
  arrayUnion,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';
import { map, Observable, of } from 'rxjs';
import { Invitation } from '../interfaces/invite.interface';
import { privateUser, publicUser } from '../interfaces/user.interface';
import { AlertsService } from './alerts.service';
import { combinedChats } from '../interfaces/chats.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly auth = inject(Auth);
  private readonly Fire = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertsService);

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

      await setDoc(
        userRef,
        {
          createdChats: arrayUnion({
            chatId: chatName,
            chatName: chatName,
          }),
        },
        { merge: true }
      );

      this.authService.currentUser();
    } catch (error) {
      console.log(error);
    }
  }

  getInvitations(): Observable<Invitation[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);

    const invRef = collection(this.Fire, `users/${user.uid}/invitations`);

    return collectionData(invRef) as Observable<Invitation[]>;
  }

  async sendInvite(user: publicUser, chatId: string) {
    const curUser = this.auth.currentUser;
    if (!curUser) return;

    const invId = `${curUser.uid}_${chatId}`;
    const userRef = doc(this.Fire, `users/${user.uid}/invitations/${invId}`);

    try {
      await setDoc(userRef, {
        invitedBy: curUser.uid,
        username: curUser.displayName,
        chat_id: chatId,
        status: 'pending',
        time: serverTimestamp(),
      });
      this.alertService.toast('Invite sent', 'success', 'green');
    } catch (error) {
      this.alertService.toast('Invite already sent', 'error', 'red');
      console.error(error);
    }
  }

  acceptInvite(
    chatData: { chatName: string; chatId: string },
    invitedBy: string
  ) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.Fire, `users/${user.uid}`);

    updateDoc(userRef, {
      chats: arrayUnion(chatData),
    });

    const invId = `${invitedBy}_${chatData.chatId}`;
    const invRef = doc(this.Fire, `users/${user.uid}/invitations/${invId}`);
    deleteDoc(invRef);

    this.alertService.toast('Invite accepted', 'success', 'green');
  }

  declineInvite(
    chatData: { chatName: string; chatId: string },
    invitedBy: string
  ) {
    const user = this.auth.currentUser;
    if (!user) return;

    const invId = `${invitedBy}_${chatData.chatId}`;
    const invRef = doc(this.Fire, `users/${user.uid}/invitations/${invId}`);
    deleteDoc(invRef);

    this.alertService.toast('Invite rejected', 'success', 'green');
  }

  loadChats(): Observable<combinedChats | null> {
    const user = this.auth.currentUser;
    if (!user) return of(null);

    const userRef = doc(this.Fire, `users/${user.uid}`);

    return docData(userRef).pipe(
      map((data) => {
        const userData = data as privateUser;
        if (!userData) return null;

        const created = userData.createdChats ?? [];
        const joined = userData.chats ?? [];

        const allChats = [...created, ...joined];

        return { allChats };
      })
    );
  }
}
