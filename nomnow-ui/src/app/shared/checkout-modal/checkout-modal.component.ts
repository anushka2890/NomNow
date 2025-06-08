import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class CheckoutModalComponent {
  @Input() cartItems: CartItem[] = [];
  @Input() totalPrice: number = 0;
  @Input() userId: number = 1;
  @Input() restaurantId: number = 1;

  @Output() close = new EventEmitter<void>();

  address: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onClose(): void {
    this.close.emit();
  }

  onConfirm() {
    if (!this.address.trim()) {
      this.errorMessage = 'Please enter a delivery address.';
      return;
    }

    const orderPayload = {
      userId: this.userId,
      restaurantId: this.restaurantId,
      address: this.address,
      items: this.cartItems.map(item => ({
        productId: item.id, // or item.productId depending on your data model
        quantity: item.quantity
      }))
    };
  console.log('Placing order with payload:', orderPayload);
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post('http://localhost:8081/api/orders', orderPayload).subscribe({
      next: (response) => {
        this.successMessage = 'Order placed successfully!';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to place order. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
