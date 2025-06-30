import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { combineLatest, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer.model';

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
  errorMessage: string = '';
  availableOffers: Offer[] = [];
  selectedOffer: Offer | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCart();

    combineLatest([
      this.cartService.getCart(),
      this.offerService.getAllOffers()
    ]).subscribe(([items, offers]) => {
      this.availableOffers = offers.filter((offer) =>
        this.isOfferApplicableToCart(offer, items)
      );
    });

    this.offerService.selectedOffer$.subscribe((offer) => {
      this.selectedOffer = offer;
    });
  }

  isOfferApplicableToCart(offer: Offer, cartItems: CartItem[]): boolean {
    if (!offer) return false;

    // ✅ Global offers (e.g., no restriction)
    if (!offer.restaurantId && (!offer.category || offer.category.toLowerCase() === 'all')) {
      return true;
    }

    // ✅ Restaurant-specific offer
    if (offer.restaurantId) {
      return cartItems.some(item => item.restaurantId === offer.restaurantId);
    }

    // ✅ Category-based offer (only works if CartItem has category)
    if (offer.category) {
      return cartItems.some(item => (item as any).category?.toLowerCase() === offer.category.toLowerCase());
    }

    return false;
  }


  selectOffer(offer: Offer): void {
    this.cartItems$.pipe(take(1)).subscribe(items => {
      const total = this.getTotal(items);
      if (offer.offerType === 'FLAT' && offer.discountAmount > total) {
        this.errorMessage = 'This offer cannot be applied. Cart total is too low.';
      } else {
        this.errorMessage = '';
        this.offerService.applyOffer(offer);
      }
    });
  }


  removeOffer(): void {
    this.offerService.removeOffer();
  }

  onClose(): void {
    this.close.emit();
  }

  removeItem(name: string): void {
    this.cartService.removeItem(name);
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
      this.removeItem(item.name);
    }
  }

  openCheckout(): void {
    this.showCheckoutModal = true;
  }

  closeCheckout(): void {
    this.showCheckoutModal = false;
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getDiscountedTotal(items: CartItem[]): number {
    const total = this.getTotal(items);

    if (!this.selectedOffer) return total;

    if (this.selectedOffer.offerType === 'FLAT') {
      const discount = Math.min(this.selectedOffer.discountAmount, total);
      return total - discount;
    } else if (this.selectedOffer.offerType === 'PERCENTAGE') {
      const discounted = total * (1 - this.selectedOffer.discountAmount / 100);
      return parseFloat(discounted.toFixed(2));
    }

    return total;
  }
}
