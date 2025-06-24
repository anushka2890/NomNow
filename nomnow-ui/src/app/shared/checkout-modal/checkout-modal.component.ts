import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../services/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderResponse } from '../../models/OrderResponse.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
  
  @Output() close = new EventEmitter<void>();

  userId?: number;

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
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.restaurantId = this.cartService.getRestaurantId();
    const cachedUserId = this.userService.getUserId();
    if (cachedUserId) {
      this.userId = cachedUserId;
    } else {
      console.error('User ID not set in UserService');
    }
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

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });


    console.log('Placing order with payload:', orderPayload);
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, orderPayload, { headers }).subscribe({
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
        localStorage.setItem('lastOrderId', this.createdOrderId!.toString());
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
