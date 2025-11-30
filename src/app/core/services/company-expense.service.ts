import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { CompanyExpense } from '../models/company-expense.model';

@Injectable({ providedIn: 'root' })
export class CompanyExpenseService {
  private expenses$ = new BehaviorSubject<CompanyExpense[]>([]);

  constructor() {
    const demo: CompanyExpense[] = Array.from({ length: 30 }, (_, i) => ({
      id: uuidv4(),
      date: this.randomDate(),
      label: `Expense ${i + 1}`,
      montant: Math.floor(Math.random() * 2000) + 100
    }));
    this.expenses$.next(demo);
  }

  private randomDate(): string {
    const start = new Date(2023, 0, 1).getTime();
    const end = new Date().getTime();
    return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10);
  }

  list(): Observable<CompanyExpense[]> { return this.expenses$.asObservable(); }
  get(id: string): Observable<CompanyExpense | undefined> { return of(this.expenses$.value.find(e => e.id === id)); }
  create(payload: Partial<CompanyExpense>): Observable<CompanyExpense> {
    const e: CompanyExpense = { id: uuidv4(), ...payload } as CompanyExpense;
    this.expenses$.next([e, ...this.expenses$.value]);
    return of(e);
  }
  update(id: string, patch: Partial<CompanyExpense>): Observable<CompanyExpense | undefined> {
    const updated = this.expenses$.value.map(e => e.id === id ? { ...e, ...patch } : e);
    this.expenses$.next(updated);
    return of(updated.find(e => e.id === id));
  }
  delete(id: string): Observable<boolean> {
    this.expenses$.next(this.expenses$.value.filter(e => e.id !== id));
    return of(true);
  }
}
