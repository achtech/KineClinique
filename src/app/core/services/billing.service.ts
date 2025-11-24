import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Invoice { id: string; patientId: string; amount: number; status: 'paid'|'unpaid'|'pending'; date: string; description?: string; }

@Injectable({ providedIn: 'root' })
export class BillingService {
  private invoices$ = new BehaviorSubject<Invoice[]>([]);
  constructor() {
    const statuses: Array<'paid' | 'unpaid' | 'pending'> = ['paid','unpaid','pending'];
    const demo: Invoice[] = Array.from({length: 30}, (_, i) => ({
      id: `inv-${i+1}`,
      patientId: `pat-${(i%10)+1}`,
      amount: Math.round(Math.random()*100+50),
      status: statuses[i%3],
      date: new Date(Date.now() - i*86400000).toISOString(),
      description: `Facture ${i+1}`
    }));
    this.invoices$.next(demo);
  }
  list(): Observable<Invoice[]> { return this.invoices$.asObservable(); }
  get(id: string): Observable<Invoice | undefined> { return of(this.invoices$.value.find(i => i.id === id)); }
  create(payload: Partial<Invoice>): Observable<Invoice> { const inv: Invoice = { id: uuidv4(), date: new Date().toISOString(), status: 'pending', amount: payload.amount ?? 0, patientId: payload.patientId!, description: payload.description ?? '' }; this.invoices$.next([...this.invoices$.value, inv]); return of(inv); }
  update(id: string, patch: Partial<Invoice>): Observable<Invoice | undefined> { const updated = this.invoices$.value.map(i => i.id === id ? { ...i, ...patch } : i); this.invoices$.next(updated); return of(updated.find(i => i.id === id)); }
  delete(id: string): Observable<boolean> { this.invoices$.next(this.invoices$.value.filter(i => i.id !== id)); return of(true); }
}
