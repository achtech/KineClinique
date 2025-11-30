import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyExpense } from '../../core/models/company-expense.model';

@Component({
  selector: 'app-company-expenses-dialog',
  templateUrl: './company-expenses-dialog.component.html',
  styleUrls: ['./company-expenses-dialog.component.scss']
})
export class CompanyExpensesDialogComponent {
  expenseForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CompanyExpensesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', item?: CompanyExpense },
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      id: [data.item?.id || null],
      date: [data.item?.date || '', Validators.required],
      label: [data.item?.label || '', Validators.required],
      montant: [data.item?.montant || '', [Validators.required, Validators.min(0)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.expenseForm.valid) {
      this.dialogRef.close(this.expenseForm.value);
    }
  }
}
