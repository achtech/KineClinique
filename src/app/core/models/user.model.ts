export interface User {
  id?: string | number;
  email: string;
  username?: string;
  roles?: string[];
  // ajoute d'autres champs selon ton API
}