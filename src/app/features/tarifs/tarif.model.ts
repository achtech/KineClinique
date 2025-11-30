export type TarifType = 'seance' | 'pack' | 'promotion';
export type PlaceType = 'maison' | 'cabinet';

export interface Tarif {
  id: number;
  type: TarifType;
  prestation: string;
  montant: number;
  place: PlaceType;
}
