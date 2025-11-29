import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private patients$ = new BehaviorSubject<Patient[]>([]);
  constructor() {
    const insuranceOptions = ['none', 'CNOPS', 'CNSS', 'Other'];
    const demo: Patient[] = Array.from({length: 30}, (_, i) => {
      const insuranceType = insuranceOptions[i % insuranceOptions.length] as Patient['insuranceType'];
      const hasMutuelle = insuranceType !== 'none';
      return {
        id: `pat-${i+1}`,
        cin: `CIN${100000 + i}`,
        firstName: `Prénom${i+1}`,
        lastName: `Nom${i+1}`,
        dob: `198${i%10}-0${(i%12)+1}-15`,
        phone: `06${Math.floor(10000000 + Math.random()*89999999)}`,
        email: `patient${i+1}@demo.com`,
        address: `Adresse ${i+1}`,
        insuranceType,
        mutuelleNumber: hasMutuelle ? `MUT-${2000 + i}` : '',
        doctor: `Dr. ${['Amina','Karim','Salma','Rachid'][i % 4]}`,
        disease: i % 4 === 0 ? 'Hypertension' : (i % 3 === 0 ? 'Diabetes' : ''),
        allergies: i%3===0 ? ['pollen','nuts'] : [],
        medicalHistory: i%2===0 ? 'Aucun' : 'Asthme',
        // Demo ordonnance files: use placeholder links (in real app these should be uploaded and real URLs)
        ordonnanceFiles: i % 5 === 0 ? [
          `https://example.com/ordonnance_${i+1}_a.pdf`,
          `https://example.com/ordonnance_${i+1}_b.pdf`
        ] : [],
        // Demo attachment URL
        attachmentUrl: i % 6 === 0 ? `https://example.com/attachment_${i+1}.pdf` : '',
        createdAt: new Date(Date.now() - i*86400000).toISOString()
      } as Patient;
    });
    this.patients$.next(demo);
  }

  list(): Observable<Patient[]> { return this.patients$.asObservable(); }
  get(id: string): Observable<Patient | undefined> { return of(this.patients$.value.find(p => p.id === id)); }
  create(payload: Partial<Patient>): Observable<Patient> {
    const p: Patient = { id: uuidv4(), createdAt: new Date().toISOString(), ...payload } as Patient;
    this.patients$.next([...this.patients$.value, p]);
    return of(p);
  }
  update(id: string, patch: Partial<Patient>): Observable<Patient | undefined> {
    const updated = this.patients$.value.map(p => p.id === id ? { ...p, ...patch } : p);
    this.patients$.next(updated);
    return of(updated.find(p => p.id === id));
  }
  delete(id: string): Observable<boolean> {
    this.patients$.next(this.patients$.value.filter(p => p.id !== id));
    return of(true);
  }
}
