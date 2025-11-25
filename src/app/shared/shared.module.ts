import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './pipes/translate.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    TranslatePipe,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    TranslatePipe,
    MatDialogModule,
    ConfirmDialogComponent
  ]
})
export class SharedModule {}
