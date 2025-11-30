import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreItem } from '../../core/models/store.model';

@Component({
  selector: 'app-store-dialog',
  templateUrl: './store-dialog.component.html',
  styleUrls: ['./store-dialog.component.scss']
})
export class StoreDialogComponent {
  storeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', item?: StoreItem },
    private fb: FormBuilder
  ) {
    this.storeForm = this.fb.group({
      id: [data.item?.id || null],
      productId: [data.item?.productId || '', Validators.required],
      dateOperation: [data.item?.dateOperation || '', Validators.required],
      quantity: [data.item?.quantity || '', [Validators.required, Validators.min(0)]],
      prixVente: [data.item?.prixVente || '', [Validators.required, Validators.min(0)]],
      comment: [data.item?.comment || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.storeForm.valid) {
      this.dialogRef.close(this.storeForm.value);
    }
  }
}
