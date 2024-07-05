import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

export const httpTranslateLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http);
}
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public currentLang: string = localStorage.getItem('lang') || 'en'

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    translate.addLangs(['ka', 'en']);
    translate.setDefaultLang(this.currentLang);
    this.document.documentElement.lang = this.currentLang;
  }

  translateLanguageTo(lang: string) {
    // changing index file translate attribute
    this.document.documentElement.lang = lang;

    // changing translateService current language
    this.translate.use(lang);

    // saving new language value into localStoragte
    localStorage.setItem('lang', lang);

    // changing currentlang variable value
    this.currentLang = lang;
  }

}
