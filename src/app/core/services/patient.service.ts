import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private patients$ = new BehaviorSubject<Patient[]>([]);
  constructor() {
    const demo: Patient[] = Array.from({length: 30}, (_, i) => ({
      id: `pat-${i+1}`,
      firstName: `Prénom${i+1}`,
      lastName: `Nom${i+1}`,
      dob: `198${i%10}-0${(i%12)+1}-15`,
      phone: `06${Math.floor(10000000 + Math.random()*89999999)}`,
      email: `patient${i+1}@demo.com`,
      address: `Adresse ${i+1}`,
      allergies: i%3===0 ? ['pollen','nuts'] : [],
      medicalHistory: i%2===0 ? 'Aucun' : 'Asthme',
      createdAt: new Date(Date.now() - i*86400000).toISOString()
    }));
    this.patients$.next(demo);
  }
  list(): Observable<Patient[]> { return this.patients$.asObservable(); }
  get(id: string): Observable<Patient | undefined> { return of(this.patients$.value.find(p => p.id === id)); }
  create(payload: Partial<Patient>): Observable<Patient> { const p: Patient = { id: uuidv4(), createdAt: new Date().toISOString(), ...payload } as Patient; this.patients$.next([...this.patients$.value, p]); return of(p); }
  update(id: string, patch: Partial<Patient>): Observable<Patient | undefined> { const updated = this.patients$.value.map(p => p.id === id ? { ...p, ...patch } : p); this.patients$.next(updated); return of(updated.find(p => p.id === id)); }
  delete(id: string): Observable<boolean> { this.patients$.next(this.patients$.value.filter(p => p.id !== id)); return of(true); }
}
