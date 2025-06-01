export interface Invitation {
  chat_id: string;
  chatName: string;
  invitedBy: string;
  username: string;
  status: string; // could be "pending" | "accepted"
  time: Date;
}
