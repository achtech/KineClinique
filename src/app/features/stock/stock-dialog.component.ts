import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockItem } from '../../core/models/stock.model';

@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.scss']
})
export class StockDialogComponent {
  stockForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', item?: StockItem },
    private fb: FormBuilder
  ) {
    this.stockForm = this.fb.group({
      id: [data.item?.id || null],
      productId: [data.item?.productId || '', Validators.required],
      label: [data.item?.label || '', Validators.required],
      quantity: [data.item?.quantity || '', [Validators.required, Validators.min(0)]],
      prixAchat: [data.item?.prixAchat || '', [Validators.required, Validators.min(0)]],
      prixVente: [data.item?.prixVente || '', [Validators.required, Validators.min(0)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.stockForm.valid) {
      this.dialogRef.close(this.stockForm.value);
    }
  }
}
