import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss']
})
export class SessionDialogDialogComponent implements OnInit {
  form: FormGroup;
  mode: 'create'|'edit' = 'create';

  constructor(
    private fb: FormBuilder,
    private service: SessionService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [''],
      'patientId': ['', Validators.required],
      'date': ['', Validators.required],
      'practitionerId': [''],
      'type': ['']
    });
  }

  ngOnInit(){ if(this.data?.mode === 'edit' && this.data.item){ this.mode = 'edit'; this.form.patchValue(this.data.item || {}); } }

  save(){ const value = this.form.value; if(this.mode === 'create'){ this.service.create(value).subscribe(()=>this.dialogRef.close(true)); } else { this.service.update(value.id, value).subscribe(()=>this.dialogRef.close(true)); } }
}
