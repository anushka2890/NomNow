import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from '../../models/OrderResponse.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-status',
  imports: [CommonModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css',
  standalone: true
})
export class OrderStatusComponent implements OnInit, OnDestroy{

  @Input() orderId! :number;
  order?: OrderResponse;
  pollingSubscription?: Subscription;

  constructor(private http: HttpClient, private route: ActivatedRoute, private auth: AuthService ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
       console.error('Order ID route param is missing or invalid');
       return;
     }
     const token = this.auth.getToken();
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${this.orderId}`, { headers })
      .subscribe(data => {
        this.order = data;
        if(['PAYMENT_SUCCESS', 'PAYMENT_FAILED'].includes(this.order.status)){
          this.pollingSubscription?.unsubscribe();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

}
