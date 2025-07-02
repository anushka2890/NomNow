import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, Observable, take } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { OfferService } from '../../services/offer.service';
import { OfferDTO } from '../../models/offer.model';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutModalComponent]
})

export class CartSidebarComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  showCheckoutModal = false;
  availableOffers: OfferDTO[] = [];
  selectedOffer: OfferDTO | null = null;
  errorMessage: string = '';

  @Output() close = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCart();

    combineLatest([
      this.cartItems$,
      this.offerService.getAllOffers()
    ]).subscribe(([items, offers]) => {
      this.availableOffers = offers.filter(offer => this.isRelevantOffer(offer, items));

      // Auto-apply item-specific offer if present
      const itemLevelOffer = offers.find(
        offer => offer.menuItemId && items.some(item => item.id === offer.menuItemId)
      );
      if (itemLevelOffer) {
        this.selectedOffer = itemLevelOffer;
        this.offerService.applyOffer(itemLevelOffer);
      }
    });

    this.offerService.selectedOffer$.subscribe(offer => {
      this.selectedOffer = offer;
    });
  }

  isRelevantOffer(offer: OfferDTO, cartItems: CartItem[]): boolean {
    if (offer.menuItemId) {
      return cartItems.some(item => item.id === offer.menuItemId);
    }

    if (offer.restaurantId) {
      return cartItems.some(item => item.restaurantId === offer.restaurantId);
    }

    // Global offer: no item, no restaurant, and category is 'all'
    return (
      !offer.menuItemId &&
      !offer.restaurantId &&
      offer.category?.toLowerCase() === 'all'
    );
  }

  selectOffer(offer: OfferDTO): void {
    if (this.selectedOffer?.id === offer.id) return;

    if (this.selectedOffer?.menuItemId && offer.id !== this.selectedOffer.id) {
      this.errorMessage = 'Remove the item-exclusive deal to apply another offer.';
      return;
    }

    this.selectedOffer = offer;
    this.offerService.applyOffer(offer);
    this.errorMessage = '';
  }

  removeOffer(): void {
    this.offerService.removeOffer();
    this.selectedOffer = null;
    this.errorMessage = '';
  }

  onClose(): void {
    this.close.emit();
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
      this.cartService.removeItem(item.name);
    }
  }

  getEffectiveItemPrice(item: CartItem): number {
    if (this.selectedOffer?.menuItemId === item.id) {
      const discount = this.selectedOffer.discountAmount;
      if (this.selectedOffer.offerType === 'FLAT') {
        return Math.max(0, item.price - discount);
      } else {
        return parseFloat((item.price * (1 - discount / 100)).toFixed(2));
      }
    }
    return item.price;
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
      const price = this.getEffectiveItemPrice(item);
      return sum + price * item.quantity;
    }, 0);
  }

  getDiscountedTotal(items: CartItem[]): number {
    const total = this.getTotal(items);

    if (!this.selectedOffer || this.selectedOffer.menuItemId) return total;

    if (this.selectedOffer.offerType === 'FLAT') {
      return Math.max(0, total - this.selectedOffer.discountAmount);
    }

    if (this.selectedOffer.offerType === 'PERCENTAGE') {
      return parseFloat((total * (1 - this.selectedOffer.discountAmount / 100)).toFixed(2));
    }

    return total;
  }
}
