import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme',
  template: `
    <div class="theme-wrapper">
      <div class="current-block" *ngIf="currentColor">
        <div class="current-label">Current</div>
        <div class="current-swatch" [ngStyle]="{'background': currentColor}"></div>
      </div>

      <div class="theme-grid" role="list" aria-label="Theme color palette">
        <button *ngFor="let c of colors"
                class="color-swatch"
                [ngStyle]="{'background': c}"
                (click)="selectColor(c)"
                [attr.aria-label]="'Select theme color ' + c"
                type="button">
          <span class="check" *ngIf="currentColor === c">✓</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .theme-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .current-block {
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:6px;
      min-width:64px;
    }

    .current-label {
      font-size:12px;
      color: rgba(0,0,0,0.6);
    }

    .current-swatch {
      width:44px;
      height:44px;
      border-radius:8px;
      border: 2px solid rgba(0,0,0,0.08);
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
      align-items: center;
      justify-items: center;
      padding: 6px;
    }

    .color-swatch {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 2px solid rgba(0,0,0,0.08);
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
      cursor: pointer;
      outline: none;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease;
      padding: 0;
      font-size: 14px;
      color: white;
      font-weight: 700;
    }

    .color-swatch:hover,
    .color-swatch:focus {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.12);
      border-color: rgba(0,0,0,0.18);
    }

    .color-swatch:focus-visible {
      box-shadow: 0 0 0 3px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.12);
    }

    .color-swatch .check {
      position: relative;
      z-index: 2;
      font-size: 14px;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0,0,0,0.45);
    }
  `]
})
export class ThemeComponent implements OnInit {
  colors: string[] = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    '#795548', '#9E9E9E', '#607D8B', '#000000',
    '#FFFFFF', '#B71C1C', '#1B5E20', '#0D47A1'
  ];

  currentColor = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Load saved color (if any) and apply it
    try {
      const saved = localStorage.getItem('app_theme_color');
      if (saved) {
        this.applyColor(saved);
      }
    } catch (e) {
      // ignore storage errors
    }
  }

  selectColor(color: string) {
    this.applyColor(color);
  }

  private applyColor(color: string) {
    this.currentColor = color;

    // Normalize color to hex (ensure it's a string like #rrggbb)
    const normalized = this.normalizeColor(color);

    // Compute on-primary contrast color (black or white)
    const onPrimary = this.getContrastColor(normalized);

    // Compute an rgba background for light panels (12% alpha)
    const rgbaBg = this.hexToRgba(normalized, 0.12);

    // Apply CSS variables on :root
    try {
      document.documentElement.style.setProperty('--app-primary', normalized);
      document.documentElement.style.setProperty('--app-on-primary', onPrimary);
      document.documentElement.style.setProperty('--app-primary-bg', rgbaBg);
      // Also set a data attribute for selectors if needed
      this.renderer.setAttribute(document.documentElement, 'data-app-theme', normalized);
    } catch (e) {
      // fallback to renderer if direct style access fails
      this.renderer.setStyle(document.documentElement, '--app-primary', normalized);
      this.renderer.setStyle(document.documentElement, '--app-on-primary', onPrimary);
      this.renderer.setStyle(document.documentElement, '--app-primary-bg', rgbaBg);
      this.renderer.setAttribute(document.documentElement, 'data-app-theme', normalized);
    }

    // Persist selection in localStorage
    try {
      localStorage.setItem('app_theme_color', normalized);
    } catch (e) {
      // ignore storage errors
    }

    // As a robust fallback — some Material styles can still override variables;
    // set inline styles on common elements so change is immediate.
    this.applyInlineFallbacks(normalized, onPrimary, rgbaBg);
  }

  // Normalize color input to full hex (#rrggbb). If already hex, return it.
  private normalizeColor(c: string): string {
    if (!c) return '#000000';
    const cc = c.trim();
    // If short hex e.g. #fff
    if (/^#([0-9a-f]{3})$/i.test(cc)) {
      return '#' + cc.substr(1).split('').map(ch => ch + ch).join('');
    }
    // If 6-digit hex or other, return as-is
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

  private hexToRgba(hex: string, alpha: number) {
    const h = hex.replace('#', '');
    if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(h.substr(0, 2), 16);
    const g = parseInt(h.substr(2, 2), 16);
    const b = parseInt(h.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  // Force inline fallback styles on commonly used elements so the change is immediate
  private applyInlineFallbacks(color: string, onPrimary: string, bg: string) {
    try {
      // Toolbar
      const toolbars = document.querySelectorAll('.mat-toolbar.mat-primary');
      toolbars.forEach((el: Element) => {
        (el as HTMLElement).style.setProperty('background-image', 'none', 'important');
        (el as HTMLElement).style.setProperty('background-color', color, 'important');
        (el as HTMLElement).style.setProperty('color', onPrimary, 'important');
      });

      // Primary buttons
      const primaryButtons = document.querySelectorAll(
        'button.mat-raised-button.mat-primary, button.mat-flat-button.mat-primary, button.mat-stroked-button.mat-primary, button.mat-button.mat-primary'
      );
      primaryButtons.forEach((btn: Element) => {
        (btn as HTMLElement).style.setProperty('background-image', 'none', 'important');
        (btn as HTMLElement).style.setProperty('background-color', color, 'important');
        (btn as HTMLElement).style.setProperty('color', onPrimary, 'important');
        (btn as HTMLElement).style.setProperty('border-color', color, 'important');
      });

      // Side menu background + text/icons
      const sideMenus = document.querySelectorAll('.side-menu, .mat-nav-list, .mat-list-base');
      sideMenus.forEach((el: Element) => {
        (el as HTMLElement).style.setProperty('background-image', 'none', 'important');
        (el as HTMLElement).style.setProperty('background-color', color, 'important');
        (el as HTMLElement).style.setProperty('color', onPrimary, 'important');
      });

      const menuItems = document.querySelectorAll('.side-menu a, .mat-list-item, .side-menu .mat-icon');
      menuItems.forEach((el: Element) => {
        (el as HTMLElement).style.setProperty('color', onPrimary, 'important');
      });

      // Active side-menu items
      const activeMenu = document.querySelectorAll('.side-menu a.active-menu, .side-menu a.active-menu .mat-icon, .side-menu a.active-menu .mat-list-text, .side-menu a.active-menu span');
      activeMenu.forEach((el: Element) => {
        (el as HTMLElement).style.setProperty('background', bg, 'important');
        (el as HTMLElement).style.setProperty('color', onPrimary, 'important');
        (el as HTMLElement).style.setProperty('font-weight', '700', 'important');
      });

      // Table header/backgrounds that used the light pink
      const headers = document.querySelectorAll('.mat-header-cell, .mat-header-row, .staff-table th, .mat-header-cell');
      headers.forEach((el: Element) => {
        (el as HTMLElement).style.setProperty('background', bg, 'important');
        (el as HTMLElement).style.setProperty('color', color, 'important');
      });
    } catch (e) {
      // ignore
    }
  }
}
