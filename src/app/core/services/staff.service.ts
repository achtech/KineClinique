import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Staff } from '../models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private staff$ = new BehaviorSubject<Staff[]>([]);
  constructor() { const demo: Staff[] = [ { id: uuidv4(), firstName: 'Alex', lastName: 'Bernard', role: 'kiné', email: 'alex@example.com' } ]; this.staff$.next(demo); }
  list(): Observable<Staff[]> { return this.staff$.asObservable(); }
  get(id: string): Observable<Staff | undefined> { return of(this.staff$.value.find(s => s.id === id)); }
  create(payload: Partial<Staff>): Observable<Staff> { const s: Staff = { id: uuidv4(), ...payload } as Staff; this.staff$.next([...this.staff$.value, s]); return of(s); }
  update(id: string, patch: Partial<Staff>): Observable<Staff | undefined> { const updated = this.staff$.value.map(s => s.id === id ? { ...s, ...patch } : s); this.staff$.next(updated); return of(updated.find(s => s.id === id)); }
  delete(id: string): Observable<boolean> { this.staff$.next(this.staff$.value.filter(s => s.id !== id)); return of(true); }
}
