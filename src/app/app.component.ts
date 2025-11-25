import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageCode, TranslationService } from './core/services/translation.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KineClinic';
  languages = this.translationService.getAvailableLanguages();
  activeLanguage$: Observable<LanguageCode> = this.translationService.language$;
  direction$: Observable<'ltr' | 'rtl'>;
  isLoginRoute = false;

  constructor(
    private translationService: TranslationService,
    private router: Router,
    private authService: AuthService
  ) {
    this.direction$ = this.translationService.language$.pipe(
      map(lang => this.translationService.getDirection(lang))
    );

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginRoute =
        event.urlAfterRedirects === '/login' ||
        event.urlAfterRedirects === '/reset-password';
    });
  }

  setLanguage(language: LanguageCode): void {
    this.translationService.setLanguage(language);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
