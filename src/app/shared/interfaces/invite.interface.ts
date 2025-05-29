export interface Invitation {
  chat_id: string;
  invitedBy: string;
  status: string; // could be "pending" | "accepted"
  time: Date;
}
