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
  getDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';
import { filter, map, Observable, of } from 'rxjs';
import { Invitation } from '../interfaces/invite.interface';
import { privateUser, publicUser } from '../interfaces/user.interface';
import { AlertsService } from './alerts.service';
import { combinedChats } from '../interfaces/chats.interface';
import { miniChat } from '../interfaces/chat.interface';
import { getAdditionalUserInfo } from 'firebase/auth';
import { membersInter } from '../interfaces/members.interface';

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
    const chatRef = collection(this.Fire, `chats`);

    try {
      const docRef = await addDoc(chatRef, {
        chatName,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        members: [],
      });

      await setDoc(docRef, { chatId: docRef.id }, { merge: true });

      await setDoc(
        userRef,
        {
          createdChats: arrayUnion({
            chatName,
            chatId: docRef.id,
            createdBy: user.uid,
            createdAt: new Date().toISOString(),
            members: [],
          }),
        },
        { merge: true }
      );

      this.authService.currentUser();
    } catch (error) {
      console.error(error);
    }
  }

  getInvitations(): Observable<Invitation[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);

    const invRef = collection(this.Fire, `users/${user.uid}/invitations`);

    return collectionData(invRef) as Observable<Invitation[]>;
  }

  async sendInvite(user: publicUser, data: miniChat) {
    const curUser = this.auth.currentUser;
    if (!curUser) return;

    if (user.uid === curUser.uid) {
      this.alertService.toast(
        'You cant invite yourself in chat',
        'error',
        'red'
      );
      console.error('YOU CANT INVITE YOURSELF IN CHAT');
      return;
    }

    const invId = `${data.chatId}_${user.uid}`;
    const userRef = doc(this.Fire, `users/${user.uid}/invitations/${invId}`);

    try {
      await setDoc(userRef, {
        invitedBy: curUser.uid,
        username: curUser.displayName,
        chat_id: data.chatId,
        chatName: data.chatName,
        status: 'pending',
        time: serverTimestamp(),
        toUserId: user.uid,
      });

      this.alertService.toast('Invite sent', 'success', 'green');
    } catch (error) {
      this.alertService.toast('Invite already sent', 'error', 'red');
      console.error(error);
    }
  }

  async acceptInvite(chatData: Invitation) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.Fire, `users/${user.uid}`);
    const memberRef = doc(
      this.Fire,
      `chats/${chatData.chat_id}/members/${user.uid}`
    );

    await updateDoc(userRef, {
      chats: arrayUnion({
        chatId: chatData.chat_id,
        chatName: chatData.chatName,
      }),
    });

    await setDoc(memberRef, {
      username: user.displayName,
      joinedAt: new Date().toISOString(),
    });

    const invId = `${chatData.chat_id}_${user.uid}`;
    const invRef = doc(this.Fire, `users/${user.uid}/invitations/${invId}`);
    await deleteDoc(invRef);

    this.alertService.toast('Invite accepted', 'success', 'green');
  }

  declineInvite(chatData: miniChat, invitedBy: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    const invId = `${invitedBy}_${chatData.chatId}`;
    const invRef = doc(this.Fire, `users/${user.uid}/invitations/${invId}`);
    deleteDoc(invRef);

    this.alertService.toast('Invite rejected', 'success', 'green');
  }

  async quitChat(data: miniChat) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.Fire, `users/${user.uid}`);
    const userData = await getDoc(userRef);

    if (userData.exists()) {
      const snapData = userData.data() as privateUser;

      const chats: miniChat[] = snapData.chats;

      const updatedChats = chats.filter((c) => c.chatId !== data.chatId);

      await updateDoc(userRef, {
        chats: updatedChats,
      });

      this.loadChats();
    }
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
