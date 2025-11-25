import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './pipes/translate.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    TranslatePipe,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule
  ],
  exports: [
    TranslatePipe,
    MatDialogModule,
    MatTooltipModule,
    ConfirmDialogComponent
  ]
})
export class SharedModule {}
