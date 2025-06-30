import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  // ✅ Check if a token exists in localStorage
  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  // ✅ Get the stored JWT token
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  // ✅ Check if the JWT is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return Math.floor(Date.now() / 1000) > expiry;
    } catch (e) {
      return true; // Treat malformed tokens as expired
    }
  }

  // ✅ Login and store token
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, credentials).pipe(
      tap((res: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.token);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  // ✅ Logout: clear token and notify subscribers
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      this.isLoggedInSubject.next(false);
    }
  }
}
