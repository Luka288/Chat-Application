import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserMiniProfileComponent } from '../../shared/components/user-mini-profile/user-mini-profile.component';
import { MiniChatComponent } from '../../shared/components/mini-chat/mini-chat.component';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../shared/services/chat.service';
import { chatMessage } from '../../shared/interfaces/chat.interface';
import { ChatContentComponent } from '../../shared/components/chat-content/chat-content.component';
import { ScrollDirective } from '../../shared/directives/scroll.directive';
import { Message } from '../../shared/models/message.model';
import { ChatCreateModalComponent } from '../../shared/components/chat-create-modal/chat-create-modal.component';
import { privateUser } from '../../shared/interfaces/user.interface';
import { NotificationModalComponent } from './../../shared/components/notification-modal/notification-modal.component';

@Component({
  selector: 'app-chat-page',
  imports: [
    RouterModule,
    UserMiniProfileComponent,
    ReactiveFormsModule,
    FormsModule,
    MiniChatComponent,
    CommonModule,
    ChatContentComponent,
    ScrollDirective,
    ChatCreateModalComponent,
    NotificationModalComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent {
  private readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);

  // todo: invitations

  currentChat = signal<string>('');
  loadingChat = signal<boolean>(false);
  modalOpen = signal<boolean>(false);
  notificationOpen = signal<boolean>(false);

  currentUser = signal<privateUser | null>(null);

  messageControl = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  notifications = toSignal(this.chatService.getInvitations(), {
    initialValue: [],
  });

  // currentUser = toSignal(this.authService.currentUser(), {
  //   initialValue: null,
  // });

  chatContent = signal<chatMessage[]>([]);

  combinedChats = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return [...user.chats, ...(user.createdChats ?? [])];
  });

  ngOnInit(): void {
    this.fetchUser();
  }

  sendMessage(): void {
    if (this.messageControl.invalid) {
      return;
    }

    const text = this.messageControl.value.message;

    const msgObj = Message.fromData({
      sender: this.currentUser()?.username!,
      user_id: this.currentUser()?.uid!,
      text: text!,
      time: new Date().toISOString(),
      chat_id: this.currentChat(),
    });

    this.chatService.sendMessage(msgObj);

    this.messageControl.reset();
    this.fetchMessages(this.currentChat());
  }

  setChat(chat: { chatId: string; chatName: string }): void {
    this.currentChat.set(chat.chatId);
    this.fetchMessages(chat.chatId);
  }

  fetchMessages(chatId: string) {
    this.loadingChat.set(true);
    this.chatService.getMessages(chatId).subscribe((messages) => {
      this.chatContent.set(messages as chatMessage[]);
      if (messages) this.loadingChat.set(false);
    });
  }

  fetchUser() {
    this.authService.currentUser().subscribe((user) => {
      console.log(user);
      this.currentUser.set(user);
    });
  }

  async createChat(chatName: string): Promise<void> {
    await this.chatService.createChat(chatName);
    this.fetchUser();
  }
}
