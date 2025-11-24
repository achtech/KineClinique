export interface Billing {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  status: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;

}
