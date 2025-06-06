export interface combinedChats {
  allChats: miniChat[];
}

export interface miniChat {
  chatName: string;
  chatId: string;
}

export interface chatMessage {
  sender: string;
  user_id: string;
  text: string;
  time: Date | string;
  chat_id: string;
  chatLocation?: string;
}

export interface chat {
  chatName: string;
  chatId: string;
  createdBy: string;
  createdAt: Date;
  members: string[];
  messages: chatMessage[];
}
