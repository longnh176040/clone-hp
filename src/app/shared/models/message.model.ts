export interface Message {
  username?: string;
  content?: string;
  uid?: string;
  created_at?: string;
  room_id?: string;
  socket_id?: string;
  received_socket_id?: string;
}