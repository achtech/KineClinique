import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SharedModule } from '../../shared/shared.module';
import { CompanyExpensesListComponent } from './company-expenses-list.component';
import { CompanyExpensesDialogComponent } from './company-expenses-dialog.component';

@NgModule({
  declarations: [
    CompanyExpensesListComponent,
    CompanyExpensesDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    SharedModule
  ],
  exports: [
    CompanyExpensesListComponent
  ]
})
export class CompanyExpensesModule { }
