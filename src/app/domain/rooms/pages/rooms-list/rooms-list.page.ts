import { Component, inject } from '@angular/core';
import { RoomsService } from '../../services/rooms.service';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
@Component({
  imports: [RouterLink, TranslocoModule],
  templateUrl: './rooms-list.page.html',
  styleUrl: './rooms-list.page.scss',
})
export class RoomsListPage {
  protected readonly roomsService = inject(RoomsService);
}
