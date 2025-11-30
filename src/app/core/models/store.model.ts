export interface StoreItem {
  id: string;
  productId: string;
  dateOperation: string; // ISO date string
  quantity: number;
  prixVente: number;
  comment: string;
}
