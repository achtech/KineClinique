import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tarif, TarifType, PlaceType } from './tarif.model';

@Component({
  selector: 'app-tarifs-dialog',
  templateUrl: './tarifs-dialog.component.html',
  styleUrls: ['./tarifs-dialog.component.scss']
})
export class TarifsDialogComponent {
  tarifForm: FormGroup;
  typeOptions: { value: TarifType, label: string }[] = [
    { value: 'seance', label: 'Séance' },
    { value: 'pack', label: 'Pack' },
    { value: 'promotion', label: 'Promotion' }
  ];
  placeOptions: { value: PlaceType, label: string }[] = [
    { value: 'maison', label: 'Maison' },
    { value: 'cabinet', label: 'Cabinet' }
  ];

  constructor(
    public dialogRef: MatDialogRef<TarifsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tarif | null,
    private fb: FormBuilder
  ) {
    this.tarifForm = this.fb.group({
      id: [data?.id || null],
      type: [data?.type || '', Validators.required],
      prestation: [data?.prestation || '', Validators.required],
      montant: [data?.montant || '', [Validators.required, Validators.min(0)]],
      place: [data?.place || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.tarifForm.valid) {
      this.dialogRef.close(this.tarifForm.value);
    }
  }
}
