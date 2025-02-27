import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ICard, SocketService } from '@shared';
import { RoomsService } from '../rooms/rooms.service';

interface Game {
  id: string;
  players: {
    id: string;
    cards?: ICard[];
  }[];
  lastPlays: { userId: string; cards?: ICard[] }[];
  isStarted: boolean;
  whoIsPlaying?: string;
  playersSequence?: string[];
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly socketService = inject(SocketService);
  private readonly roomsService = inject(RoomsService);

  public readonly game = signal<Game | null>(null);
  public readonly me = computed(() => {
    const game = this.game();

    if (!game) return null;

    const clientId = this.socketService.id;
    return game.players.find(({ id }) => id === clientId);
  });
  public sequence = signal<{ id: string; card: ICard }[] | null>(null);

  constructor() {
    console.log(Date.now());
    this.socketService.emitMessage('getGame', this.roomsService.currentRoomId());

    this.socketService.onEvent('game', this.game.set);
    this.socketService.onEvent('playersSequence', this.sequence.set);

    effect(() => {
      console.log(this.game());
    });
  }

  public playCard(cards?: { id: number; hasValueOf?: number }[]) {
    const game = this.game();

    if (game?.whoIsPlaying === this.me()?.id) this.socketService.emitMessage('playCard', { roomId: game?.id, cards });
  }
}
