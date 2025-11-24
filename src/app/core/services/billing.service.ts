import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Billing } from '../models/billing.model';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private billings$ = new BehaviorSubject<Billing[]>([]);
  constructor() {
    const statuses: Array<'paid' | 'unpaid' | 'pending'> = ['paid','unpaid','pending'];
    const demo: Billing[] = Array.from({length: 30}, (_, i) => ({
      id: `inv-${i+1}`,
      patientId: `pat-${(i%10)+1}`,
      amount: Math.round(Math.random()*100+50),
      status: statuses[i%3],
      date: new Date(Date.now() - i*86400000).toISOString(),
      description: `Facture ${i+1}`
    }));
    this.billings$.next(demo);
  }
  list(): Observable<Billing[]> { return this.billings$.asObservable(); }
  get(id: string): Observable<Billing | undefined> { return of(this.billings$.value.find(i => i.id === id)); }
  create(payload: Partial<Billing>): Observable<Billing> { const inv: Billing = { id: uuidv4(), date: new Date().toISOString(), status: 'pending', amount: payload.amount ?? 0, patientId: payload.patientId!, description: payload.description ?? '' }; this.billings$.next([...this.billings$.value, inv]); return of(inv); }
  update(id: string, patch: Partial<Billing>): Observable<Billing | undefined> { const updated = this.billings$.value.map(i => i.id === id ? { ...i, ...patch } : i); this.billings$.next(updated); return of(updated.find(i => i.id === id)); }
  delete(id: string): Observable<boolean> { this.billings$.next(this.billings$.value.filter(i => i.id !== id)); return of(true); }
}
