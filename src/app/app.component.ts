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
      map(lang => this.translationService.getDirection(lang as LanguageCode))
    );

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginRoute =
        event.urlAfterRedirects === '/login' ||
        event.urlAfterRedirects === '/reset-password';
    });

    // Apply saved theme (if present) at app startup so layout reflects selection immediately
    this.applySavedTheme();
  }

  setLanguage(language: LanguageCode): void {
    this.translationService.setLanguage(language);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Load saved color from localStorage and apply as CSS variables on :root
  private applySavedTheme() {
    try {
      const saved = localStorage.getItem('app_theme_color');
      if (!saved) return;
      const normalized = this.normalizeColor(saved);
      const onPrimary = this.getContrastColor(normalized);
      try {
        document.documentElement.style.setProperty('--app-primary', normalized);
        document.documentElement.style.setProperty('--app-on-primary', onPrimary);
        document.documentElement.setAttribute('data-app-theme', normalized);
      } catch (e) {
        // ignore
      }
      // As a fallback, also set inline styles on key elements so the UI updates immediately
      try {
        const toolbars = document.querySelectorAll('.mat-toolbar.mat-primary');
        toolbars.forEach((el: Element) => {
          (el as HTMLElement).style.setProperty('background-image', 'none', 'important');
          (el as HTMLElement).style.setProperty('background-color', normalized, 'important');
          (el as HTMLElement).style.setProperty('color', onPrimary, 'important');
        });
        const primaryButtons = document.querySelectorAll(
          'button.mat-raised-button.mat-primary, button.mat-flat-button.mat-primary, button.mat-stroked-button.mat-primary, button.mat-button.mat-primary'
        );
        primaryButtons.forEach((btn: Element) => {
          (btn as HTMLElement).style.setProperty('background-image', 'none', 'important');
          (btn as HTMLElement).style.setProperty('background-color', normalized, 'important');
          (btn as HTMLElement).style.setProperty('color', onPrimary, 'important');
          (btn as HTMLElement).style.setProperty('border-color', normalized, 'important');
        });
        const activeMenu = document.querySelectorAll('.side-menu a.active-menu .mat-icon, .side-menu a.active-menu .mat-list-text, .side-menu a.active-menu span');
        activeMenu.forEach((el: Element) => {
          (el as HTMLElement).style.setProperty('color', normalized, 'important');
          (el as HTMLElement).style.setProperty('font-weight', '700', 'important');
        });
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore storage errors
    }
  }

  // Normalize color input to full hex (#rrggbb). If already hex, return it.
  private normalizeColor(c: string): string {
    if (!c) return '#000000';
    const cc = c.trim();
    // If short hex e.g. #fff
    if (/^#([0-9a-f]{3})$/i.test(cc)) {
      return '#' + cc.substr(1).split('').map(ch => ch + ch).join('');
    }
    // If 6-digit hex or other, return lowercase
    if (/^#([0-9a-f]{6})$/i.test(cc)) {
      return cc;
    }
    // Try to parse rgb(...) format
    const rgbMatch = cc.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return this.rgbToHex(r, g, b);
    }
    // Last resort: return given string
    return cc;
  }

  private rgbToHex(r: number, g: number, b: number) {
    const toHex = (n: number) => {
      const v = Math.max(0, Math.min(255, Math.round(n)));
      return ('0' + v.toString(16)).slice(-2);
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Return '#ffffff' or '#000000' depending on contrast against the background color
  private getContrastColor(hex: string): string {
    // strip #
    const h = hex.replace('#', '');
    if (h.length !== 6) return '#000000';
    const r = parseInt(h.substr(0, 2), 16);
    const g = parseInt(h.substr(2, 2), 16);
    const b = parseInt(h.substr(4, 2), 16);
    // Calculate luminance per W3C
    const srgb = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    // If luminance is high, return black, else white
    return lum > 0.5 ? '#000000' : '#ffffff';
  }
}
