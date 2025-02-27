 
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTransloco, TranslocoTestingModule } from '@jsverse/transloco';
import { TRANSLOCO_OPTIONS } from '../transloco/transloco.config';
import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';
import pt from '../../../assets/i18n/pt.json';

export const TRANSLOCO_PROVIDERS = [provideTransloco(TRANSLOCO_OPTIONS), provideHttpClient(), provideHttpClientTesting()];
export const TRANSLOCO_MODULE_IMPORT = [];
