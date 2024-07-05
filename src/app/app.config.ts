import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNzIcons } from './icons-provider';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { authInterceptor } from './core/interceptors';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { httpRequestInterceptor } from './core/interceptors';
import { httpTranslateLoaderFactory } from './core/services';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

const ngZorroConfig: NzConfig = {
  form: {
    nzAutoTips: {
      default: {
        required: 'ველი სავალდებულოა',
      },
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions(),  withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, httpRequestInterceptor])),
    provideAnimations(),
    provideNzI18n(en_US),
    provideNzIcons(),
    provideNzConfig(ngZorroConfig),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      },
    })),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializerFactory,
    //   deps: [TranslateService, Injector],
    //   multi: true
    // },
    DatePipe
  ]
};
