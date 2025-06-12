import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  restaurantId: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  private restaurantId: number | null = null;

  setRestaurantId(id: number) {
    this.restaurantId = id;
  }

  getRestaurantId(): number | null {
    return this.restaurantId;
  }

  getCart(){
    return this.cartSubject.asObservable();
  }

  addToCart(item: CartItem) {
    const existing = this.cartItems.find(ci => ci.name === item.name);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.cartSubject.next(this.cartItems);
  }

  removeItem(itemName: string) {
    this.cartItems = this.cartItems.filter(i => i.name !== itemName);
    this.cartSubject.next(this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
  }

  constructor() { }
}
