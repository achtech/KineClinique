export interface Prescription {
  id: string;
  patientId: string;
  prescriber: string;
  sessionsPrescribed: number;
  sessionsUsed: number;
  createdAt?: string;
  documentUrl?: string; // lien vers image/scan
}
