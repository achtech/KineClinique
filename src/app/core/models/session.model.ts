export interface Session {
  id: string;
  patientId: string;
  date: string; // ISO
  type: string; // e.g., "renforcement"
  practitionerId: string;
  notes?: string;
}
