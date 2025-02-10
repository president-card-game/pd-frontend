import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { Translation, TranslocoLoader, TranslocoOptions, TranslocoService } from '@jsverse/transloco';
import { LocalStorageService } from '@shared';
import { ELanguage } from '../enums/language.enum';
import { EStorageKey } from '../enums/storage-key.enum';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly httpClient = inject(HttpClient);
  public getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`assets/i18n/${lang}.json`);
  }
}

export function loadDefaultLanguage() {
  const defaultLang = inject(LocalStorageService).getItem<string>(EStorageKey.APP_LANG) ?? ELanguage.PT;
  return inject(TranslocoService).load(defaultLang);
}

export const TRANSLOCO_OPTIONS: TranslocoOptions = {
  config: {
    availableLangs: [ELanguage.PT, ELanguage.EN, ELanguage.ES],
    defaultLang: ELanguage.EN,
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
};
