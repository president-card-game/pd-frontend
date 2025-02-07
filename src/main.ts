import { provideHttpClient } from '@angular/common/http';
import { provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { loadDefaultLanguage, TRANSLOCO_OPTIONS } from '@shared';
import { firstValueFrom } from 'rxjs';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    provideTransloco(TRANSLOCO_OPTIONS),
    provideAppInitializer(() => firstValueFrom(loadDefaultLanguage())),
  ],
}).catch((err) => console.error(err));
