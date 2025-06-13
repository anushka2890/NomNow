import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from '../../models/OrderResponse.model';

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

  constructor(private http: HttpClient, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
       console.error('Order ID route param is missing or invalid');
       return;
     }
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.http.get<OrderResponse>(`http://localhost:8081/api/orders/${this.orderId}`)
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
