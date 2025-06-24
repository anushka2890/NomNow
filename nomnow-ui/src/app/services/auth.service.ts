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

  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

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

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      this.isLoggedInSubject.next(false);
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }
}