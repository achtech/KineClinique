import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogDialogComponent implements OnInit {
  form: FormGroup;
  mode: 'create'|'edit' = 'create';
  attachmentFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [''],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'dob': [''],
      'phone': [''],
      'email': [''],
      'attachmentUrl': ['']
    });
  }

  ngOnInit() {
    if (this.data?.mode === 'edit' && this.data.item) {
      this.mode = 'edit';
      this.form.patchValue(this.data.item || {});
    }
  }

  onAttachmentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachmentFile = input.files[0];
      // Simulate upload: read as data URL (in real app, upload to server and get URL)
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ attachmentUrl: reader.result as string });
      };
      reader.readAsDataURL(this.attachmentFile);
    }
  }

  save() {
    const value = this.form.value;
    if (this.mode === 'create') {
      this.service.create(value).subscribe(() => this.dialogRef.close(true));
    } else {
      this.service.update(value.id, value).subscribe(() => this.dialogRef.close(true));
    }
  }
}
