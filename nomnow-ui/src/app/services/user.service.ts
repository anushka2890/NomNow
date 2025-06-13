import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OrderResponse } from '../models/OrderResponse.model';
import { UserDTO } from '../models/UserDTO.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  private userSubject = new BehaviorSubject<UserDTO>({
    id: 1,
    name: 'Anushka Chauhan',
    email: 'anushka@example.com',
    phone: '9876543210',
  });

  getUser(): Observable<UserDTO> {
    return this.userSubject.asObservable();
  }

  updateUser(id: number, updatedUser: UserDTO): Observable<UserDTO> {
  return this.http.put<UserDTO>(`http://localhost:8084/api/users/${id}`, updatedUser);
}


  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`http://localhost:8084/api/users/${id}`);
  }

  getOrderHistory(userId: number): Observable<OrderResponse[]> {
  return this.http.get<OrderResponse[]>(`http://localhost:8081/api/orders/user/${userId}`);
}
}
