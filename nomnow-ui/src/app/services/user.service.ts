import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderResponse } from '../models/OrderResponse.model';
import { UserDTO } from '../models/UserDTO.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUser?: UserDTO;
  private BASE_URL = `${environment.apiUrl}/users`;
  private userId?: number;

  constructor(private http: HttpClient) {}

  setUserId(id: number) {
    this.userId = id;
  }

  getUserId(): number | undefined {
    return this.userId;
  }
  
  getUserProfile(): Observable<UserDTO> {
    if (typeof window === 'undefined') {
      // SSR environment — skip localStorage access
      return of(); // or throw error, depending on how you handle fallback
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<UserDTO>(`${this.BASE_URL}/profile`, { headers }).pipe(
      tap(user => {this.setUserId(user.id);
        this.setUser(user);
      })
    );
  }

  setUser(user: UserDTO): void {
    this.loggedInUser = user;
  }

  getLoggedInUser(): UserDTO | undefined {
    return this.loggedInUser;
  }

  updateUser(id: number, updatedUser: UserDTO): Observable<UserDTO> {
  return this.http.put<UserDTO>(`${environment.apiUrl}/users/${id}`, updatedUser);
}


  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${environment.apiUrl}/users/${id}`);
  }

  getOrderHistory(userId: number): Observable<OrderResponse[]> {
    if (typeof window === 'undefined') {
    // SSR environment — skip localStorage access
    return of(); // or throw error, depending on how you handle fallback
  }

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders/user/${userId}`, {headers});
}
}
