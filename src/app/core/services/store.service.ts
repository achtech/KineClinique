import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { StoreItem } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private store$ = new BehaviorSubject<StoreItem[]>([]);

  constructor() {
    const demo: StoreItem[] = Array.from({ length: 30 }, (_, i) => ({
      id: uuidv4(),
      productId: `P-${1000 + i}`,
      dateOperation: this.randomDate(),
      quantity: Math.floor(Math.random() * 100) + 1,
      prixVente: Math.floor(Math.random() * 300) + 50,
      comment: `Comment for operation ${i + 1}`
    }));
    this.store$.next(demo);
  }

  private randomDate(): string {
    const start = new Date(2023, 0, 1).getTime();
    const end = new Date().getTime();
    return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10);
  }

  list(): Observable<StoreItem[]> { return this.store$.asObservable(); }
  get(id: string): Observable<StoreItem | undefined> { return of(this.store$.value.find(e => e.id === id)); }
  create(payload: Partial<StoreItem>): Observable<StoreItem> {
    const e: StoreItem = { id: uuidv4(), ...payload } as StoreItem;
    this.store$.next([e, ...this.store$.value]);
    return of(e);
  }
  update(id: string, patch: Partial<StoreItem>): Observable<StoreItem | undefined> {
    const updated = this.store$.value.map(e => e.id === id ? { ...e, ...patch } : e);
    this.store$.next(updated);
    return of(updated.find(e => e.id === id));
  }
  delete(id: string): Observable<boolean> {
    this.store$.next(this.store$.value.filter(e => e.id !== id));
    return of(true);
  }
}
