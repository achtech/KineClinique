import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';
import { Patient } from 'src/app/core/models/patient.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
  standalone: true,
  imports: [CommonModule, NgClass]
})
export class PatientDetailsComponent implements OnInit {
  activeTab: string = 'overview';
  patient: Patient = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1993-05-15',
    address: '123 Main Street',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    insuranceType: 'CNSS',
    mutuelleNumber: '123456789',
    doctor: 'Dr. Smith',
    disease: 'Hypertension',
    medicalHistory: 'No prior conditions',
    allergies: ['Peanuts', 'Shellfish'],
    ordonnanceFiles: ['https://example.com/ordonnance1.pdf', 'https://example.com/ordonnance2.pdf'],
    attachmentUrl: 'https://example.com/attachment.pdf',
    createdAt: '2025-11-30'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
