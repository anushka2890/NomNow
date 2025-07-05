import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from '../../models/OrderResponse.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { OrderTrackingService } from '../../services/order-tracking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliveryTrackingComponent } from "../../sections/delivery-tracking/delivery-tracking.component";

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, DeliveryTrackingComponent],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css'
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  @Input() orderId!: number;
  order?: OrderResponse;
  statusSubscription?: Subscription;

  allStatusSteps: string[] = [
    'PENDING',
    'ORDER_CONFIRMED',
    'PAYMENT_SUCCESS',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
  ];

  failureStatuses: string[] = ['PAYMENT_FAILED', 'CANCELLED'];
  deliveryCoordinates: [number, number] = [19.0760, 72.8777]; // Set dynamically if needed

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private auth: AuthService,
    private orderTrackingService: OrderTrackingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
      console.error('Order ID route param is missing or invalid');
      return;
    }

    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${this.orderId}`, { headers })
      .subscribe((data) => {
        this.order = data;
        this.orderTrackingService.connect(this.orderId);

        this.statusSubscription = this.orderTrackingService.orderStatus$.subscribe((status: string) => {
          if (this.order && this.order.status !== status && status !== 'INITIAL') {
            const oldStatus = this.order.status;
            this.order.status = status;

            this.snackBar.open(
              `📦 Order status updated: ${this.getReadableStatus(status)}`,
              'OK',
              { duration: 3000 }
            );

            console.log(`🧭 Order status changed from ${oldStatus} → ${status}`);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.statusSubscription?.unsubscribe();
    this.orderTrackingService.disconnect();
  }

  getReadableStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  isFailureStatus(): boolean {
    return this.failureStatuses.includes(this.order?.status || '');
  }

  getProgressSteps(): string[] {
    const currentStatus = this.order?.status;
    if (!currentStatus || this.isFailureStatus()) return [];

    const index = this.allStatusSteps.indexOf(currentStatus);
    return index >= 0 ? this.allStatusSteps.slice(0, index + 1) : [];
  }
  canCancel(): boolean {
    const cancellableStatuses = [
      'PENDING',
      'CONFIRMED',
      'PAYMENT_PENDING',
      'PAYMENT_SUCCESS'
    ];
    return this.order ? cancellableStatuses.includes(this.order.status) : false;
  }

  cancelOrder(): void{
    if(!this.order) return;
    this.http.put(`${environment.apiUrl}/orders/${this.order.orderId}/cancel`, {})
    .subscribe({
      next: () => {
        this.snackBar.open('Order cancelled successfully ✅', 'OK', { duration: 3000 });
        this.order!.status = 'CANCELLED';
      },
      error: (err) => {
        console.error('Cancel failed', err);
        this.snackBar.open('Failed to cancel order ❌', 'OK', { duration: 3000 });
      }
    });
  }
  get restaurantLat(): number {
    return 19.0760; // Mumbai example
  }

  get restaurantLng(): number {
    return 72.8777;
  }

  get deliveryLat(): number {
    return 19.0950;
  }

  get deliveryLng(): number {
    return 72.8850;
  }
}
