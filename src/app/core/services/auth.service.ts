import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use Angular Signals to represent current auth state reactively
  currentUser = signal<{ username: string; role: string } | null>(null);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  saveSession(token: string, role: string, username: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('username', username);
    this.currentUser.set({ username, role });
  }

  loadUserFromStorage() {
    const token = this.getToken();
    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');

    if (token && role && username) {
      this.currentUser.set({ username, role });
    } else {
      this.currentUser.set(null);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}
