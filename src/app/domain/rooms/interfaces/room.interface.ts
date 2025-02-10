export interface User {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
}
