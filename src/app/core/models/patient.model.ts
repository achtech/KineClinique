export interface Patient {
  id: string; // uuid
  cin?: string; // National ID / CIN
  firstName: string;
  lastName: string;
  dob?: string | Date; // Date of birth (ISO string e.g. YYYY-MM-DD) or Date object
  phone?: string;
  email?: string;
  address?: string;
  insuranceType?: 'none' | 'CNOPS' | 'CNSS' | 'Other'; // type of mutual insurance
  mutuelleNumber?: string;
  doctor?: string;
  disease?: string;
  medicalHistory?: string; // medical historic
  allergies?: string[];
  ordonnanceFiles?: string[]; // URLs to ordonnance/prescription files
  attachmentUrl?: string; // URL to a single attachment document
  createdAt?: string;
}
