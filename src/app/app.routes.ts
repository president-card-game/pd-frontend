import { Route } from '@angular/router';

import { ROOMS_ROUTES } from '@domain';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    children: ROOMS_ROUTES,
  },
];
