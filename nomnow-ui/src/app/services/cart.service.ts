import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { OfferDTO } from '../models/offer.model';
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  restaurantId: number;
  category?: string;
  offer?: OfferDTO | null;
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

  getCartTotal(): Observable<number> {
    return this.getCart().pipe(
      map(items => items.reduce((sum, item) => sum + item.price * item.quantity, 0))
    );
  }
  updateCartItem(updatedItem: CartItem) {
    const index = this.cartItems.findIndex(item => item.name === updatedItem.name);
    if (index !== -1) {
      this.cartItems[index] = updatedItem;
      this.cartSubject.next(this.cartItems);
    }
  }

  constructor() { }
}
