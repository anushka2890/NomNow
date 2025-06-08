import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, CheckoutModalComponent]
})
export class CartSidebarComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  showCheckoutModal = false;

  @Output() close = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCart();
  }

  onClose(): void {
    this.close.emit();
  }

  removeItem(name: string): void {
    this.cartService.removeItem(name);
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  openCheckout(): void {
    this.showCheckoutModal = true;
  }

  closeCheckout(): void {
    this.showCheckoutModal = false;
  }
}
