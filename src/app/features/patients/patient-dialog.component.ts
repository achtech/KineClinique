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
  mode: 'create'|'edit'|'details' = 'create';
  attachmentFile: File | null = null;
  ordonnanceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [''],
      cin: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [''],
      phone: [''],
      email: [''],
      insuranceType: ['none'],
      mutuelleNumber: [''],
      doctor: [''],
      disease: [''],
      medicalHistory: [''],
      ordonnanceFiles: [[]],
      attachmentUrl: [''],
      address: [''],
      allergies: [[]],
      createdAt: ['']
    });
  }

  ngOnInit() {
    if ((this.data?.mode === 'edit' || this.data?.mode === 'details') && this.data.item) {
      this.mode = this.data.mode;
      // ensure ordonnanceFiles/allergies default to arrays if undefined
      const item = {
        ...this.data.item,
        ordonnanceFiles: this.data.item?.ordonnanceFiles || [],
        allergies: this.data.item?.allergies || []
      };
      this.form.patchValue(item || {});
    } else if (this.data?.mode === 'create') {
      this.mode = 'create';
    }
  }

  /**
   * Header full name:
   * - For edit/details modes the user requested "Patient : LastName + FirstName"
   * - For create mode keep FirstName + LastName (or '-' if empty)
   */
  get fullName(): string {
    const fn = this.form.value.firstName || '';
    const ln = this.form.value.lastName || '';
    if (this.mode === 'edit' || this.mode === 'details') {
      // "LastName FirstName" per request
      const combined = `${ln} ${fn}`.trim();
      return combined || '-';
    }
    // create mode (or default) show FirstName LastName
    const combined = `${fn} ${ln}`.trim();
    return combined || '-';
  }

  onOrdonnanceFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const urls: string[] = [];
      let processed = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          urls.push(reader.result as string);
          processed++;
          if (processed === files.length) {
            this.form.patchValue({ ordonnanceFiles: urls });
          }
        };
        reader.readAsDataURL(file);
      });
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
    } else if (this.mode === 'edit') {
      this.service.update(value.id, value).subscribe(() => this.dialogRef.close(true));
    } else {
      this.dialogRef.close();
    }
  }

  // Close/cancel both close the dialog; we expose a named method for clarity
  close() {
    this.dialogRef.close();
  }
}
