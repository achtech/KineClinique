export type TarifType = 'seance' | 'pack' | 'promotion';
export type PlaceType = 'maison' | 'cabinet';

export interface Tarifs {
  id: string;
  type: TarifType;
  prestation: string;
  montant: number;
  place: PlaceType;
}
