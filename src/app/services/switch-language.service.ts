import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SwitchLanguageService {
  private currentLang: BehaviorSubject<string> = new BehaviorSubject('');
  public currentLangExp = this.currentLang.asObservable();

  constructor(
    private translateService: TranslateService
  ) { }

  emitCurrentLang(lang: string): void {
    this.currentLang.next(lang);
  }

  setDefaultLanguage(): void {
    const lang = localStorage.getItem('lang') || 'en';
    this.translateService.setDefaultLang(lang);
    this.emitCurrentLang(lang);
  }

  switchLanguage(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
    this.emitCurrentLang(lang);
  }

  defineLanguage(): string {
    return this.translateService.currentLang;
  }

  getLanguages(): string[] {
    return this.translateService.getLangs();
  }
}
