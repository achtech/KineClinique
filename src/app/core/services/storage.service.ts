import { Injectable } from '@angular/core';

const TOKEN_KEY = 'app_token';
const USER_KEY = 'app_user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any | null {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  }

  public clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
