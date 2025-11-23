export interface Patient {
  id: string; // uuid
  firstName: string;
  lastName: string;
  dob?: string; // ISO date
  phone?: string;
  email?: string;
  address?: string;
  allergies?: string[];
  medicalHistory?: string;
  createdAt?: string;
}
