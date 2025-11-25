import { NgModule, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
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
      <div class="left-controls">
        <button mat-icon-button aria-label="Previous" (click)="prev()">
          <mat-icon>chevron_left</mat-icon>
        </button>

        <div class="title">
          <div *ngIf="view === 'day'">{{ selectedDate | date:'fullDate' }}</div>
          <div *ngIf="view === 'week'">{{ weekStart | date:'MMM d' }} - {{ weekEnd | date:'MMM d, yyyy' }}</div>
          <div *ngIf="view === 'month'">{{ currentMonth | date:'MMMM yyyy' }}</div>
        </div>

        <button mat-icon-button aria-label="Next" (click)="next()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <h2 class="sr-only">{{ 'nav.agenda' | translate }}</h2>

      <div class="controls">
        <mat-button-toggle-group [(ngModel)]="view" appearance="legacy" aria-label="View selector" class="view-toggle">
          <mat-button-toggle value="day">
            <mat-icon>today</mat-icon>
            <span class="label"> {{ 'agenda.view.day' | translate }}</span>
          </mat-button-toggle>
          <mat-button-toggle value="week">
            <mat-icon>view_week</mat-icon>
            <span class="label"> {{ 'agenda.view.week' | translate }}</span>
          </mat-button-toggle>
          <mat-button-toggle value="month">
            <mat-icon>calendar_month</mat-icon>
            <span class="label"> {{ 'agenda.view.month' | translate }}</span>
          </mat-button-toggle>
        </mat-button-toggle-group>

        <button mat-raised-button color="primary" (click)="today()">{{ 'common.today' | translate }}</button>
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
              <button mat-icon-button aria-label="Previous month" (click)="prevMonth()">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <div class="month-title">{{ currentMonth | date:'MMMM yyyy' }}</div>
              <button mat-icon-button aria-label="Next month" (click)="nextMonth()">
                <mat-icon>chevron_right</mat-icon>
              </button>
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
    .agenda-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; gap:12px; }
    .left-controls { display:flex; align-items:center; gap:8px; min-width:260px; }
    .title { text-align:center; font-weight:600; min-width:180px; }
    .sr-only { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }

    .controls { display:flex; gap:8px; align-items:center; }
    .view-toggle { display:flex; gap:6px; align-items:center; background:transparent; }
    .view-toggle .mat-button-toggle { display:flex; align-items:center; gap:6px; padding:6px 10px; border-radius:6px; }
    .view-toggle .mat-button-toggle.mat-button-toggle-checked { background: linear-gradient(90deg, rgba(0,120,212,0.12), rgba(0,120,212,0.06)); }
    .mat-button-toggle-button {color:brown !important;}
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
    .month-controls { display:flex; align-items:center; gap:8px; margin-bottom:8px; justify-content:center; }
    .month-body { display:flex; flex-direction:column; gap:6px; }
    .month-row { display:flex; gap:6px; }
    .month-day { flex:1; min-height:80px; border:1px solid #eee; padding:6px; cursor:pointer; }
    .day-number { font-weight:600; margin-bottom:6px; }

    /* Style overrides for the agenda view selector panel (Material overlay lives outside component DOM) */
    /* ::ng-deep is used to reach into the overlay - keep these rules minimal and specific */
    ::ng-deep .agenda-select-panel .mat-select-panel {
      background: #2f2f2f; /* dark panel */
      color: #fff;
      min-width: 140px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      padding: 6px 0;
    }
    ::ng-deep .agenda-select-panel .mat-option {
      color: #fff;
      padding: 10px 18px;
      font-size: 14px;
      height: auto;
      line-height: 20px;
      border-radius: 4px;
      margin: 2px 8px;
    }
    ::ng-deep .agenda-select-panel .mat-option:hover {
      background: rgba(255,255,255,0.04);
    }
    ::ng-deep .agenda-select-panel .mat-option.mat-selected {
      background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
      color: #fff;
      font-weight: 600;
    }
    ::ng-deep .agenda-select-panel .mat-option .mat-pseudo-checkbox,
    ::ng-deep .agenda-select-panel .mat-option .mat-option-ripple {
      display: none !important; /* hide default checkbox/ripple for a cleaner look */
    }
  `]
})
export class AgendaComponent {
  view: 'day' | 'week' | 'month' = 'week';
  hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  weekDays: string[] = [];
  currentMonth = new Date();
  monthMatrix: (Date | null)[][] = [];
  // Selected date used for "day" view and to center week view when going to today
  selectedDate: Date = new Date();

  constructor(private dialog: MatDialog, private datePipe: DatePipe) {
    this.generateWeekDays();
    this.buildMonthMatrix();
  }

  // Helpers for week display (start and end)
  get weekStart(): Date {
    const base = new Date(this.selectedDate);
    const dayIndex = base.getDay();
    // Start on Monday
    const diff = (dayIndex === 0) ? -6 : 1 - dayIndex;
    const start = new Date(base);
    start.setDate(base.getDate() + diff);
    return start;
  }

  get weekEnd(): Date {
    const end = new Date(this.weekStart);
    end.setDate(this.weekStart.getDate() + 6);
    return end;
  }

  generateWeekDays(baseDate: Date = this.selectedDate) {
    const start = new Date(baseDate);
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
    let date = new Date(this.selectedDate);
    if (this.view === 'week' && dayLabel) {
      // try to map the dayLabel to an actual date in the displayed week
      const idx = this.weekDays.indexOf(dayLabel);
      if (idx >= 0) {
        const start = this.weekStart;
        date = new Date(start);
        date.setDate(start.getDate() + idx);
      }
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
    const now = new Date();
    this.selectedDate = now;
    if (this.view === 'month') {
      // Reset the calendar to the current month
      this.currentMonth = now;
      this.buildMonthMatrix();
    } else if (this.view === 'week') {
      // Center the week view on the current date
      this.generateWeekDays(now);
    } else if (this.view === 'day') {
      // Select today for the day view (useful for highlighting or pre-filling dialogs)
      // selectedDate already set
      this.generateWeekDays(now);
    }
  }

  prev() {
    if (this.view === 'day') {
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() - 1);
      this.selectedDate = d;
      this.generateWeekDays(this.selectedDate);
    } else if (this.view === 'week') {
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() - 7);
      this.selectedDate = d;
      this.generateWeekDays(this.selectedDate);
    } else if (this.view === 'month') {
      this.prevMonth();
    }
  }

  next() {
    if (this.view === 'day') {
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() + 1);
      this.selectedDate = d;
      this.generateWeekDays(this.selectedDate);
    } else if (this.view === 'week') {
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() + 7);
      this.selectedDate = d;
      this.generateWeekDays(this.selectedDate);
    } else if (this.view === 'month') {
      this.nextMonth();
    }
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
    // chunk into weeks (ensure each week has 7 cells)
    const matrix: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      const slice = days.slice(i, i + 7);
      while (slice.length < 7) slice.push(null);
      matrix.push(slice);
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
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [DatePipe],
  exports: [AgendaComponent]
})
export class AgendaModule {}
