import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SocketService } from '@shared';
import { Room, User } from '../../interfaces/room.interface';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private readonly socketService = inject(SocketService);
  public readonly rooms = signal<Room[]>([]);
  public readonly currentRoomId = signal<string | null>(null);
  public readonly currentRoom = computed(() => {
    const roomId = this.currentRoomId();
    if (!roomId) return null;

    return this.rooms().find((room) => room.id === roomId);
  });
  public readonly me = computed(() => {
    const room = this.currentRoom();
    if (!room) return null;

    return room.users.find((user) => user.id === this.socketService.id);
  });
  public readonly currentRoom$ = toObservable(this.currentRoom);

  constructor() {
    this.socketService.onEvent('roomsUpdate', this.onRoomsUpdated.bind(this));
    this.socketService.onEvent('roomCreated', this.onRoomCreated.bind(this));
    this.socketService.onEvent('errorMessage', console.log);
  }

  private onRoomsUpdated(data: Room[]) {
    this.rooms.set(data);
  }

  private onRoomCreated(room: Omit<Room, 'users'>) {
    this.currentRoomId.set(room['id']);
    this.rooms.update((rooms) => [...rooms, { ...room, users: [] }]);
  }

  private onRoomUsersUpdated(users: User[]) {
    const currentRoomId = this.currentRoomId();

    this.rooms.update((rooms) =>
      rooms.map((room) => {
        const isCurrentRoom = room.id === currentRoomId;

        return isCurrentRoom ? { ...room, users } : room;
      }),
    );
  }

  public joinRoom(roomId: string) {
    this.socketService.onEvent('roomUsers', this.onRoomUsersUpdated.bind(this));

    this.socketService.emitMessage('joinRoom', { roomId });

    const currentRoomId = this.currentRoomId();

    if (!currentRoomId) {
      this.currentRoomId.set(roomId);
    }
  }

  public createRoom(roomName: string) {
    this.socketService.emitMessage('createRoom', roomName);
  }

  public toggleIsReady() {
    const roomId = this.currentRoomId();

    if (!roomId) return;

    this.socketService.emitMessage('toggleUserReady', { roomId, isReady: this.me()?.isReady });
  }

  public leaveRoom() {
    const roomId = this.currentRoomId();

    if (!roomId) return;

    this.socketService.emitMessage('leaveRoom', roomId);
    this.socketService.removeListener('roomUsers');

    this.currentRoomId.set(null);
  }

  public startGame() {
    if (!this.me()?.isHost) return;

    this.socketService.emitMessage('startGame', this.currentRoomId());
  }
}
