import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Tarifs, TarifType, PlaceType } from '../models/tarifs.model';

@Injectable({ providedIn: 'root' })
export class TarifsService {
  private tarifs$ = new BehaviorSubject<Tarifs[]>([]);
  constructor() {
    const types: TarifType[] = ['seance', 'pack', 'promotion'];
    const prestations = [
      'Consultation', 'Massage', 'Rééducation', 'Pack 5 séances', 'Promo été', 'Séance spéciale',
      'Évaluation', 'Traitement', 'Pack 10 séances', 'Promo hiver', 'Séance maison', 'Séance cabinet'
    ];
    const places: PlaceType[] = ['maison', 'cabinet'];
    const demo: Tarifs[] = Array.from({length: 30}, (_, i) => ({
      id: uuidv4(),
      type: types[Math.floor(Math.random() * types.length)],
      prestation: prestations[Math.floor(Math.random() * prestations.length)],
      montant: Math.floor(Math.random() * 1000) + 200,
      place: places[Math.floor(Math.random() * places.length)]
    }));
    this.tarifs$.next(demo);
  }
  list(): Observable<Tarifs[]> { return this.tarifs$.asObservable(); }
  get(id: string): Observable<Tarifs | undefined> { return of(this.tarifs$.value.find(s => s.id === id)); }
  create(payload: Partial<Tarifs>): Observable<Tarifs> { const s: Tarifs = { id: uuidv4(), ...payload } as Tarifs; this.tarifs$.next([...this.tarifs$.value, s]); return of(s); }
  update(id: string, patch: Partial<Tarifs>): Observable<Tarifs | undefined> { const updated = this.tarifs$.value.map(s => s.id === id ? { ...s, ...patch } : s); this.tarifs$.next(updated); return of(updated.find(s => s.id === id)); }
  delete(id: string): Observable<boolean> { this.tarifs$.next(this.tarifs$.value.filter(s => s.id !== id)); return of(true); }
}
