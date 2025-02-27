import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '../../services/rooms/rooms.service';
import { TranslocoModule } from '@jsverse/transloco';
import { SocketService } from '@shared';

@Component({
  imports: [TranslocoModule],
  templateUrl: './room.page.html',
  styleUrl: './room.page.scss',
})
export class RoomPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly roomsService = inject(RoomsService);
  protected readonly socketService = inject(SocketService);

  constructor() {
    this.socketService.onEvent('gameStarted', () => this.router.navigate(['room', this.roomsService.currentRoomId(), 'game']));
  }

  protected readonly allPlayersReady = computed(() => {
    const isHost = this.roomsService.me()?.isHost;
    if (!isHost) return;

    const room = this.roomsService.currentRoom();
    return room?.users.every((user) => user.isReady);
  });

  public ngOnInit() {
    const { roomId } = this.route.snapshot.params;
    this.roomsService.joinRoom(roomId);
  }

  protected leaveRoom() {
    this.roomsService.leaveRoom();
    this.router.navigate(['/']);
  }

  protected backToInitialPage() {
    this.roomsService.currentRoomId.set(null);
    this.router.navigate(['/']);
  }
}
