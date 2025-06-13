import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { OrderResponse } from '../../models/OrderResponse.model';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit{
  constructor(private userService: UserService) {}
  loading: boolean = true;
  error: string = '';
  userId: number = 1;
  orders: OrderResponse[] = [];
  ngOnInit(): void {
      this.userService.getOrderHistory(this.userId).subscribe({
        next: (data) => {
          console.log("data:",data);
          this.orders = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load order history';
          this.loading = false;
        }
      });
    }
}
