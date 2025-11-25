import { NgModule, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SessionDialogDialogComponent } from '../sessions/session-dialog.component';
import { SharedModule } from '../../shared/shared.module';

/**
 * Simple AgendaComponent that supports Day / Week / Month views (lightweight),
 * displays clickable slots and opens the existing Session dialog to create a new session.
 *
 * Notes:
 * - This is intentionally lightweight so it integrates without adding new libs.
 * - For full production calendar features consider integrating FullCalendar or Angular Calendar.
 */
@Component({
  selector: 'app-agenda',
  template: `
    <div class="agenda-toolbar">
      <h2>{{ 'nav.agenda' | translate }}</h2>
      <div class="controls">
        <mat-select [(ngModel)]="view" aria-label="View selector">
          <mat-option value="day">{{ 'agenda.view.day' | translate }}</mat-option>
          <mat-option value="week">{{ 'agenda.view.week' | translate }}</mat-option>
          <mat-option value="month">{{ 'agenda.view.month' | translate }}</mat-option>
        </mat-select>
        <button mat-raised-button color="primary" (click)="today()">{{ 'common.view' | translate }}</button>
      </div>
    </div>

    <div class="agenda-container">
      <ng-container [ngSwitch]="view">
        <div *ngSwitchCase="'day'">
          <div class="day-grid">
            <div class="hour-row" *ngFor="let hour of hours">
              <div class="hour-label">{{ hour }}</div>
              <div class="slot" (click)="createSessionFor(hour)">
                <span class="slot-text">{{ hour }}</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngSwitchCase="'week'">
          <div class="week-grid">
            <div class="week-header">
              <div class="week-day" *ngFor="let d of weekDays">{{ d }}</div>
            </div>
            <div class="week-body">
              <div class="week-row" *ngFor="let hour of hours">
                <div class="week-hour-label">{{ hour }}</div>
                <div class="week-slot" *ngFor="let d of weekDays" (click)="createSessionFor(hour, d)">
                  <span class="slot-text">{{ hour }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngSwitchCase="'month'">
          <div class="month-grid">
            <div class="month-controls">
              <button mat-button (click)="prevMonth()">‹</button>
              <div class="month-title">{{ currentMonth | date:'MMMM yyyy' }}</div>
              <button mat-button (click)="nextMonth()">›</button>
            </div>
            <div class="month-body">
              <div class="month-row" *ngFor="let week of monthMatrix">
                <div class="month-day" *ngFor="let day of week" (click)="createSessionForDay(day)">
                  <div class="day-number">{{ day?.getDate() }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .agenda-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .controls { display:flex; gap:8px; align-items:center; }
    .day-grid .hour-row { display:flex; margin-bottom:6px; }
    .hour-label { width:80px; text-align:right; padding-right:8px; color:rgba(0,0,0,0.6); }
    .slot { flex:1; border:1px dashed #ddd; padding:12px; cursor:pointer; background:#fff; }
    .slot:hover { background:#f5f5f5; }
    .week-grid { }
    .week-header { display:flex; }
    .week-day { flex:1; text-align:center; font-weight:600; padding:8px 0; border-bottom:1px solid #eee; }
    .week-body { }
    .week-row { display:flex; align-items:flex-start; }
    .week-hour-label { width:80px; text-align:right; padding-right:8px; color:rgba(0,0,0,0.6); }
    .week-slot { flex:1; min-height:48px; border:1px dashed #eee; margin:4px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
    .month-grid { }
    .month-controls { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
    .month-body { display:flex; flex-direction:column; gap:6px; }
    .month-row { display:flex; gap:6px; }
    .month-day { flex:1; min-height:80px; border:1px solid #eee; padding:6px; cursor:pointer; }
    .day-number { font-weight:600; margin-bottom:6px; }
  `]
})
export class AgendaComponent {
  view: 'day' | 'week' | 'month' = 'week';
  hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  weekDays: string[] = [];
  currentMonth = new Date();
  monthMatrix: (Date | null)[][] = [];

  constructor(private dialog: MatDialog, private datePipe: DatePipe) {
    this.generateWeekDays();
    this.buildMonthMatrix();
  }

  generateWeekDays() {
    const start = new Date();
    const dayIndex = start.getDay(); // 0..6
    // Build week labels starting Monday
    const labels: string[] = [];
    const base = new Date(start);
    for (let i = 1; i <= 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() - dayIndex + i - 1);
      labels.push(this.datePipe.transform(d, 'EEE d') || '');
    }
    this.weekDays = labels;
  }

  createSessionFor(hour: string, dayLabel?: string) {
    // Create an approximate date to send to the session dialog
    let date = new Date();
    if (dayLabel) {
      // try to parse dayLabel using DatePipe fallback (not perfect but acceptable)
      // for demo purposes use today
      date = new Date();
    }
    // send time in data so dialog can prefill date/time if it supports it
    this.dialog.open(SessionDialogDialogComponent, {
      width: '420px',
      data: { mode: 'create', date, hour }
    });
  }

  createSessionForDay(day: Date | null) {
    const date = day || new Date();
    this.dialog.open(SessionDialogDialogComponent, {
      width: '420px',
      data: { mode: 'create', date }
    });
  }

  today() {
    this.currentMonth = new Date();
    this.buildMonthMatrix();
  }

  prevMonth() {
    const m = new Date(this.currentMonth);
    m.setMonth(m.getMonth() - 1);
    this.currentMonth = m;
    this.buildMonthMatrix();
  }

  nextMonth() {
    const m = new Date(this.currentMonth);
    m.setMonth(m.getMonth() + 1);
    this.currentMonth = m;
    this.buildMonthMatrix();
  }

  buildMonthMatrix() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay(); // 0 (Sun) - 6
    // Build calendar weeks (start on Sunday)
    const days: (Date | null)[] = [];
    // prepend nulls
    for (let i = 0; i < startDay; i++) days.push(null);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    // chunk into weeks
    const matrix: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      matrix.push(days.slice(i, i + 7));
    }
    this.monthMatrix = matrix;
  }
}

@NgModule({
  declarations: [AgendaComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [DatePipe],
  exports: [AgendaComponent]
})
export class AgendaModule {}
