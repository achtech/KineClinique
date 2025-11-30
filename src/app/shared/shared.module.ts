import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './pipes/translate.pipe';
import { ThemeComponent } from '../features/theme/theme.component';
import { ConfigurationComponent } from '../features/configuration/configuration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from './confirm-dialog.component';

// New datepicker + input modules to provide a calendar on all date inputs
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TranslatePipe,
    ConfirmDialogComponent,
    ThemeComponent,
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  exports: [
    TranslatePipe,
    MatDialogModule,
    MatTooltipModule,
    ConfirmDialogComponent,
    ThemeComponent,
    ConfigurationComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class SharedModule {}

