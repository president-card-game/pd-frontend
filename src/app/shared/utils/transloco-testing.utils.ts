/* eslint-disable @typescript-eslint/naming-convention */
import { TRANSLOCO_SCOPE, TranslocoTestingModule } from '@jsverse/transloco';
import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';
import pt from '../../../assets/i18n/pt.json';
import { ELanguage } from '../enums/language.enum';

export function getTranslocoTestingModule() {
  return TranslocoTestingModule.forRoot({
    langs: {
      [ELanguage.EN]: en,
      [ELanguage.ES]: es,
      [ELanguage.PT]: pt,
    },
    translocoConfig: {
      availableLangs: [ELanguage.EN, ELanguage.ES, ELanguage.PT],
      defaultLang: ELanguage.EN,
    },
    preloadLangs: true,
  });
}

export function getTranslocoTestingProviders(scope: string) {
  return { provide: TRANSLOCO_SCOPE, useValue: scope };
}
