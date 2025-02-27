import { Route } from '@angular/router';

export const ROOMS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/join/join.page').then((m) => m.JoinPage),
  },
  {
    path: 'room/:roomId',
    loadComponent: () => import('./pages/room/room.page').then((m) => m.RoomPage),
  },
  {
    path: 'room/:roomId/game',
    loadComponent: () => import('./pages/game/game.page').then((m) => m.GamePage),
  },
  {
    path: 'rooms',
    loadComponent: () => import('./pages/rooms-list/rooms-list.page').then((m) => m.RoomsListPage),
  },
];
