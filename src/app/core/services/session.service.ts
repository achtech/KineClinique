import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private sessions$ = new BehaviorSubject<Session[]>([]);
  list(): Observable<Session[]> { return this.sessions$.asObservable(); }
  get(id: string): Observable<Session | undefined> { return of(this.sessions$.value.find(s => s.id === id)); }
  create(payload: Partial<Session>): Observable<Session> { const s: Session = { id: uuidv4(), ...payload } as Session; this.sessions$.next([...this.sessions$.value, s]); return of(s); }
  update(id: string, patch: Partial<Session>): Observable<Session | undefined> { const updated = this.sessions$.value.map(s => s.id === id ? { ...s, ...patch } : s); this.sessions$.next(updated); return of(updated.find(s => s.id === id)); }
  delete(id: string): Observable<boolean> { this.sessions$.next(this.sessions$.value.filter(s => s.id !== id)); return of(true); }
}
