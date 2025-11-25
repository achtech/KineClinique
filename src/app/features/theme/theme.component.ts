import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {
  // 24-color palette (hex values)
  colors: string[] = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    '#795548', '#9E9E9E', '#607D8B', '#000000',
    '#FFFFFF', '#B71C1C', '#1B5E20', '#0D47A1'
  ];

  constructor(private renderer: Renderer2) {}

  selectColor(color: string) {
    // Set CSS variable on :root so the whole app can use it
    this.renderer.setStyle(document.documentElement, '--app-primary', color);
    // Also set a data attribute for possible theming rules
    this.renderer.setAttribute(document.documentElement, 'data-app-theme', color);
    // Persist selection in localStorage
    try {
      localStorage.setItem('app_theme_color', color);
    } catch (e) {
      // ignore storage errors
    }
  }
}
