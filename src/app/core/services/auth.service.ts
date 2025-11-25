import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly defaultUsername = 'Admin';
  private readonly defaultPassword = 'Admin';

  constructor(private storage: StorageService) {}

  login(username: string, password: string): boolean {
    if (username === this.defaultUsername && password === this.defaultPassword) {
      this.storage.saveToken('dummy-token');
      this.storage.saveUser({ username });
      return true;
    }
    return false;
  }

  logout(): void {
    this.storage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.storage.getToken();
  }
}
