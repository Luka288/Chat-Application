export interface privateUser {
  username: string;
  email: string;
  photoURL: string;
  uid: string;
  isAnonymous: string;
  chats: { chatName: string; chatId: string }[];
}

// chats ობიექტი ? omit?
export type publicUser = Omit<privateUser, 'email' | 'chats'>;
