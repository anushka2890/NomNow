import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, CheckoutModalComponent, FormsModule]
})
export class CartSidebarComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  showCheckoutModal = false;
  promoCode: string = '';
  promoMessage: string = '';
  discount: number = 0;
  promoApplied: boolean = false;
  appliedPromoCode: string = '';
  promoCodes: string[] = ['SAVE10', 'SAVE20', 'SAVE25', 'HALFPRICE'];

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

  increment(item: CartItem): void {
    item.quantity++;
    this.cartService.updateCartItem(item);
  }

  decrement(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCartItem(item);
    } else {
      this.removeItem(item.name); // Or set quantity to 0 if you prefer
    }
  }


  applyPromoCode() {
    const code = this.promoCode.trim().toUpperCase();
    const validCodes = this.promoCodes;

    if (validCodes.includes(code)) {
      this.appliedPromoCode = code; // 👈✅ Set applied code
      this.promoMessage = `${code} applied successfully.`;
      this.promoApplied = true;
    } else {
      this.appliedPromoCode = ''; // 👈 Clear on invalid
      this.promoMessage = 'Invalid promo code.';
      this.promoApplied = false;
    }
  }



  getDiscountedTotal(items: CartItem[]): number {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const code = this.appliedPromoCode;

    switch (code) {
      case 'SAVE10':
        return Math.round(total * 0.90);
      case 'SAVE25':
        return Math.round(total * 0.75);
      case 'SAVE20':
        return total - 20;
      case 'HALFPRICE':
        return total - 50;
      default:
        return total;
    }
  }

  getTotalAfterDiscount(items: CartItem[]): number {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total - (total * this.discount);
  }
}
