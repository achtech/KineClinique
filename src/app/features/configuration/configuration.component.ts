import { Component } from '@angular/core';

@Component({
  selector: 'app-configuration',
  // inline template to avoid possible stylesheet/template loader issues
  template: `
    <div class="configuration-page">
      <h2>Configuration</h2>

      <section class="theme-section">
        <h3>Theme</h3>
        <!-- reuse the existing Theme component -->
        <app-theme></app-theme>
      </section>
    </div>
  `,
  // small inline styles to avoid separate scss loading problems
  styles: [`
    .configuration-page { padding: 12px; }
    .theme-section { margin-top: 12px; }
    .theme-wrapper { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
  `]
})
export class ConfigurationComponent {}
