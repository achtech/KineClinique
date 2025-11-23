export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'kiné' | 'secretaire' | 'admin' | string;
  email?: string;
}
