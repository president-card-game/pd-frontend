import { computed, signal, WritableSignal } from '@angular/core';
import { Room, User } from '../interfaces';

export function generateRoomsServiceMock(currentRoom: WritableSignal<Room | null>, rooms: WritableSignal<Room[]> = signal([])) {
  return {
    joinRoom: jest.fn(),
    leaveRoom: jest.fn(),
    toggleIsReady: jest.fn(),
    currentRoomId: signal<string | null>(null),
    currentRoom: currentRoom,
    me: computed(() => {
      const userId = '1';
      return currentRoom()?.users.find((user: User) => user.id === userId);
    }),
    rooms,
  };
}
