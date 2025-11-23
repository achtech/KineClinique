import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private patients$ = new BehaviorSubject<Patient[]>([]);
  constructor() {
    const demo: Patient[] = [
      { id: uuidv4(), firstName: 'Marie', lastName: 'Dupont', dob: '1984-07-12', phone: '0612345678', createdAt: new Date().toISOString() }
    ];
    this.patients$.next(demo);
  }
  list(): Observable<Patient[]> { return this.patients$.asObservable(); }
  get(id: string): Observable<Patient | undefined> { return of(this.patients$.value.find(p => p.id === id)); }
  create(payload: Partial<Patient>): Observable<Patient> { const p: Patient = { id: uuidv4(), createdAt: new Date().toISOString(), ...payload } as Patient; this.patients$.next([...this.patients$.value, p]); return of(p); }
  update(id: string, patch: Partial<Patient>): Observable<Patient | undefined> { const updated = this.patients$.value.map(p => p.id === id ? { ...p, ...patch } : p); this.patients$.next(updated); return of(updated.find(p => p.id === id)); }
  delete(id: string): Observable<boolean> { this.patients$.next(this.patients$.value.filter(p => p.id !== id)); return of(true); }
}
