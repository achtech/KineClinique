import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Prescription } from '../models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private prescriptions$ = new BehaviorSubject<Prescription[]>([]);
  list(): Observable<Prescription[]> { return this.prescriptions$.asObservable(); }
  get(id: string): Observable<Prescription | undefined> { return of(this.prescriptions$.value.find(p => p.id === id)); }
  create(payload: Partial<Prescription>): Observable<Prescription> { const p: Prescription = { id: uuidv4(), createdAt: new Date().toISOString(), sessionsUsed: 0, ...payload } as Prescription; this.prescriptions$.next([...this.prescriptions$.value, p]); return of(p); }
  update(id: string, patch: Partial<Prescription>): Observable<Prescription | undefined> { const updated = this.prescriptions$.value.map(p => p.id === id ? { ...p, ...patch } : p); this.prescriptions$.next(updated); return of(updated.find(p => p.id === id)); }
  delete(id: string): Observable<boolean> { this.prescriptions$.next(this.prescriptions$.value.filter(p => p.id !== id)); return of(true); }
}
