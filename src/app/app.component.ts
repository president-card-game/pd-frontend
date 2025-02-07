import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'pd-root',
  template: '<router-outlet />',
})
export class AppComponent {}
