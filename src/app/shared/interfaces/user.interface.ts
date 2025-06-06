import { miniChat } from './chats.interface';

export interface privateUser {
  username: string;
  email: string;
  photoURL: string;
  uid: string;
  isAnonymous: string;
  chats: { chatName: string; chatId: string }[];
  createdChats?: { chatName: string; chatId: string }[];
}

// chats ობიექტი ? omit?
export type publicUser = Omit<privateUser, 'email' | 'chats' | 'createdChats'>;

export interface inviteUser {
  userdata: publicUser;
  currentData: miniChat;
}
