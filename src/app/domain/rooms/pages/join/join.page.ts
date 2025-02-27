import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoomsService } from '../../services/rooms/rooms.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [ReactiveFormsModule, RouterLink, TranslocoDirective],
  templateUrl: './join.page.html',
  styleUrl: './join.page.scss',
})
export class JoinPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly roomsService = inject(RoomsService);
  private readonly router = inject(Router);
  protected readonly createRoomControl = new FormControl(null, [Validators.required]);

  public createRoom() {
    const { value } = this.createRoomControl;

    if (!value) return;

    this.roomsService.createRoom(value);

    this.roomsService.currentRoom$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((room) => {
      if (room) this.router.navigate([`/room/${room.id}`]);
    });
  }
}
