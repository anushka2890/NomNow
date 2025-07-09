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
import { UserDTO } from '../../models/UserDTO.model';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';

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
  loggedInUser?: UserDTO;

  addresses: Address[] = [];
  address: string = '';
  selectedAddressId!: number ;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  createdOrderId: number | null = null;
  restaurantId: number | null = null;

  editMode = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private addressService: AddressService
  ) {}
  
  ngOnInit(): void {
    this.restaurantId = this.cartService.getRestaurantId();
  }
  fetchSavedAddresses(): void {
    this.addressService.getUserAddress().subscribe({
      next: (res) => {
        this.addresses = res;
        if (res.length > 0) {
          this.selectedAddressId = res[0].id;
          this.address = this.buildFullAddress(res[0]); // ✅
        }
      },
      error: (err) => console.error('Failed to fetch addresses', err)
    });
  }
  buildFullAddress(addr: Address): string {
    return `${addr.label}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  }
  onAddressChange(id: number): void {
    const selected = this.addresses.find(a => a.id === id);
    if (selected) {
      this.address = this.buildFullAddress(selected);
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
    const totalAmount = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const orderPayload = {
      address: this.address,
      restaurantId: this.restaurantId,
      totalAmount: totalAmount,
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

  editAddress(): void {
    this.editMode = true;
  }
}
