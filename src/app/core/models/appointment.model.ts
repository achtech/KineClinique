export interface Appointment {
  id: string;
  patientId: string;
  date: string; // ISO datetime
  practitionerId: string; // staff id
  type?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'done';
  notes?: string;
}
