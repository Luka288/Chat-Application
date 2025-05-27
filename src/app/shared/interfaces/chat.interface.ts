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
  chatLocation?: () => string;
}
