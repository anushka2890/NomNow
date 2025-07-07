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
const CART_KEY = "nomnow_cart";

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
    this.saveCartToLocalStorage();
  }

  removeItem(itemName: string) {
    this.cartItems = this.cartItems.filter(i => i.name !== itemName);
    this.cartSubject.next(this.cartItems);
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    localStorage.removeItem(CART_KEY);
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
      this.saveCartToLocalStorage();
    }
  }

  constructor() { 
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.loadCartFromLocalStorage();
    }
  }

  private saveCartToLocalStorage() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromLocalStorage() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(CART_KEY);
      if (data) {
        this.cartItems = JSON.parse(data);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  hasItems(): boolean {
    return this.cartItems.length > 0;
  } 
}
