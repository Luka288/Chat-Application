import {
  Component,
  computed,
  inject,
  signal,
  SimpleChanges,
} from '@angular/core';
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
import {
  privateUser,
  publicUser,
} from '../../shared/interfaces/user.interface';
import { NotificationModalComponent } from './../../shared/components/notification-modal/notification-modal.component';
import { UserSearchComponent } from '../../shared/components/user-search/user-search.component';
import { SearchService } from '../../shared/services/search.service';
import { Invitation } from '../../shared/interfaces/invite.interface';

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
    UserSearchComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent {
  private readonly chatService = inject(ChatService);
  private readonly searchService = inject(SearchService);
  readonly authService = inject(AuthService);

  // todo: invitations

  currentChat = signal<string>('');
  loadingChat = signal<boolean>(false);
  modalOpen = signal<boolean>(false);
  notificationOpen = signal<boolean>(false);
  searchToggle = signal<boolean>(false);
  isActive = signal<boolean>(false);

  currentUser = signal<privateUser | null>(null);

  messageControl = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  notifications = toSignal(this.chatService.getInvitations(), {
    initialValue: [],
  });

  foundUsers = signal<publicUser[] | null>(null);

  chatContent = signal<chatMessage[]>([]);

  chats = toSignal(this.chatService.loadChats(), { initialValue: null });

  ngOnInit(): void {
    this.fetchUser();

    this.chatService.loadChats().subscribe((res) => {
      console.log(res?.allChats);
    });
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

  getUserSearch(username: string) {
    this.searchService.searchUser(username)?.subscribe((res) => {
      this.foundUsers.set(res);
    });
  }

  inviteUser(userData: publicUser, chatId = this.currentChat()) {
    this.chatService.sendInvite(userData, chatId);
  }

  async createChat(chatName: string): Promise<void> {
    await this.chatService.createChat(chatName);
    this.fetchUser();
  }

  acceptInvite(data: Invitation) {
    this.chatService.acceptInvite(
      {
        chatName: data.chat_id,
        chatId: data.chat_id,
      },
      data.invitedBy
    );
  }

  declineInvite(data: Invitation) {
    this.chatService.declineInvite(
      {
        chatName: data.chat_id,
        chatId: data.chat_id,
      },
      data.invitedBy
    );
  }
}
