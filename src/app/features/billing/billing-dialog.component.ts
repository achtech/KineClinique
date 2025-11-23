import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-billing-dialog',
  templateUrl: './billing-dialog.component.html',
  styleUrls: ['./billing-dialog.component.scss']
})
export class BillingDialogDialogComponent implements OnInit {
  form: FormGroup;
  mode: 'create'|'edit' = 'create';

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [''],
      'patientId': ['', Validators.required],
      'amount': ['', Validators.required],
      'status': ['']
    });
  }

  ngOnInit(){ if(this.data?.mode === 'edit' && this.data.item){ this.mode = 'edit'; this.form.patchValue(this.data.item || {}); } }

  save(){ const value = this.form.value; if(this.mode === 'create'){ this.service.create(value).subscribe(()=>this.dialogRef.close(true)); } else { this.service.update(value.id, value).subscribe(()=>this.dialogRef.close(true)); } }
}
