import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private appointments$ = new BehaviorSubject<Appointment[]>([]);
  constructor() {
    const statuses: Array<'confirmed' | 'pending' | 'cancelled' | 'done'> = ['confirmed','pending','cancelled','done'];
    const demo: Appointment[] = Array.from({length: 30}, (_, i) => ({
      id: `apt-${i+1}`,
      patientId: `pat-${(i%10)+1}`,
      date: new Date(Date.now() + i*86400000).toISOString(),
      practitionerId: `staff-${(i%5)+1}`,
      type: ['consultation','follow-up','therapy'][i%3],
      status: statuses[i%4],
      notes: `Note ${i+1}`
    }));
    this.appointments$.next(demo);
  }
  list(): Observable<Appointment[]> { return this.appointments$.asObservable(); }
  get(id: string): Observable<Appointment | undefined> { return of(this.appointments$.value.find(a => a.id === id)); }
  create(payload: Partial<Appointment>): Observable<Appointment> { const a: Appointment = { id: uuidv4(), status: 'pending', ...payload } as Appointment; this.appointments$.next([...this.appointments$.value, a]); return of(a); }
  update(id: string, patch: Partial<Appointment>): Observable<Appointment | undefined> { const updated = this.appointments$.value.map(a => a.id === id ? { ...a, ...patch } : a); this.appointments$.next(updated); return of(updated.find(a => a.id === id)); }
  delete(id: string): Observable<boolean> { this.appointments$.next(this.appointments$.value.filter(a => a.id !== id)); return of(true); }
}
