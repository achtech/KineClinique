import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

export { LanguageCode };

export interface LanguageOption {
  code: LanguageCode;
  flag: string;
  direction: 'ltr' | 'rtl';
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly fallbackLanguage: LanguageCode = 'en';
  private readonly storageKey = 'app.language';

  private readonly languages: LanguageOption[] = [
    { code: 'en', flag: '🇬🇧', direction: 'ltr' },
    { code: 'fr', flag: '🇫🇷', direction: 'ltr' },
    { code: 'es', flag: '🇪🇸', direction: 'ltr' },
    { code: 'ar', flag: '🇲🇦', direction: 'rtl' }
  ];

  private languageSubject: BehaviorSubject<LanguageCode>;

  language$;

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as LanguageCode | null;
    const initial = saved && this.languages.find(l => l.code === saved) ? saved : this.fallbackLanguage;
    this.languageSubject = new BehaviorSubject<LanguageCode>(initial);
    this.language$ = this.languageSubject.asObservable();
  }

  getAvailableLanguages(): LanguageOption[] {
    return this.languages;
  }

  get currentLanguage(): LanguageCode {
    return this.languageSubject.value;
  }

  setLanguage(language: LanguageCode): void {
    if (this.languages.find(lang => lang.code === language)) {
      this.languageSubject.next(language);
      localStorage.setItem(this.storageKey, language);
    }
  }

  getDirection(language: LanguageCode): 'ltr' | 'rtl' {
    return this.languages.find(lang => lang.code === language)?.direction ?? 'ltr';
  }

  translate(key: string): string {
    const current = this.languageSubject.value;
    return (
      TRANSLATIONS[current]?.[key] ??
      TRANSLATIONS[this.fallbackLanguage]?.[key] ??
      key
    );
  }
}
