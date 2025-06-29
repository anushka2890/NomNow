import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MenuItemDTO, Restaurant, RestaurantDTO } from '../models/restaurant';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = `${environment.apiUrl}/rest`;

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.baseUrl);
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.baseUrl}/${id}`);
  }

  getMenuItemById(itemId: number): Observable<MenuItemDTO> {
  return this.http.get<MenuItemDTO>(`${environment.apiUrl}/menu-items/${itemId}`);
}

getMenuItemsForRestaurant(restaurantId: number): Observable<MenuItemDTO[]> {
  return this.http.get<MenuItemDTO[]>(`${environment.apiUrl}/restaurants/${restaurantId}/menu-items`);
}
}
