import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../services/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface OrderResponse {
  orderId: number;
  status: string;
  items: { productId: number; quantity: number }[];
  deliveryAddress: string;
  orderTime: string;
  restaurantId: number;
}

@Component({
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule, MatProgressSpinnerModule]
})
export class CheckoutModalComponent implements OnInit {
  @Input() cartItems: CartItem[] = [];
  @Input() totalPrice: number = 0;
  @Input() userId: number = 1;
  @Output() close = new EventEmitter<void>();

  address: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  createdOrderId: number | null = null;
  restaurantId: number | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.restaurantId = this.cartService.getRestaurantId();
  }

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (!this.address.trim()) {
      this.errorMessage = 'Please enter a delivery address.';
      return;
    }

    const orderPayload = {
      userId: this.userId,
      address: this.address,
      restaurantId: this.restaurantId,
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }))
    };

    console.log('Placing order with payload:', orderPayload);
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post<OrderResponse>('http://localhost:8081/api/orders', orderPayload).subscribe({
      next: (response) => {
        console.log('Order response:', response);
        this.createdOrderId = response.orderId;
        console.log('Created Order Id: ', this.createdOrderId);
        this.successMessage = 'Order placed successfully!';
        this.isLoading = false;
        this.cartService.clearCart(); // ✅ clear cart after success

        const snackBarRef = this.snackBar.open('Order placed successfully!', 'View Status', {
          duration: 5000,
          panelClass: 'success-snackbar'
        });

        snackBarRef.onAction().subscribe(() => {
          if (this.createdOrderId !== null && this.createdOrderId !== undefined) {
            this.router.navigate(['/order-status', this.createdOrderId]);
          } else {
            console.error('Order ID is undefined or null');
          }
        });

        this.close.emit(); // ✅ Close modal
      },
      error: (error) => {
        this.errorMessage = 'Failed to place order. Please try again.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }
}
