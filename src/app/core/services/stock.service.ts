import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { StockItem } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private stock$ = new BehaviorSubject<StockItem[]>([]);

  constructor() {
    const demo: StockItem[] = Array.from({ length: 30 }, (_, i) => ({
      id: uuidv4(),
      productId: `P-${1000 + i}`,
      label: `Product ${i + 1}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      prixAchat: Math.floor(Math.random() * 200) + 10,
      prixVente: Math.floor(Math.random() * 300) + 50
    }));
    this.stock$.next(demo);
  }

  list(): Observable<StockItem[]> { return this.stock$.asObservable(); }
  get(id: string): Observable<StockItem | undefined> { return of(this.stock$.value.find(e => e.id === id)); }
  create(payload: Partial<StockItem>): Observable<StockItem> {
    const e: StockItem = { id: uuidv4(), ...payload } as StockItem;
    this.stock$.next([e, ...this.stock$.value]);
    return of(e);
  }
  update(id: string, patch: Partial<StockItem>): Observable<StockItem | undefined> {
    const updated = this.stock$.value.map(e => e.id === id ? { ...e, ...patch } : e);
    this.stock$.next(updated);
    return of(updated.find(e => e.id === id));
  }
  delete(id: string): Observable<boolean> {
    this.stock$.next(this.stock$.value.filter(e => e.id !== id));
    return of(true);
  }
}
