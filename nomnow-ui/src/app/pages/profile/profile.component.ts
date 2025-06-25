// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { User, UserService } from '../../services/user.service';
// import { OrderResponse } from '../../models/OrderResponse.model';
// import { EnrichedOrder } from '../../models/enriched-order-response.model';
// import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.css']
// })
// export class ProfileComponent implements OnInit{
//   user !: User;
//   orders: OrderResponse[] = [];
//   enrichedOrders: EnrichedOrder[] = [];
//   loading: boolean = true;
//   restaurantService: any;

//   constructor(private userService: UserService){}

//   // ngOnInit(): void {
//   //     this.userService.getUserProfile().subscribe({
//   //       next: (data) => {
//   //         this.user = data;
//   //         console.log(data);
//   //         this.fetchOrderHistory(this.user.id);
//   //       },
//   //       error: (err) => {
//   //         console.error("Failed to load profile ", err);
//   //       }
//   //     });
//   // }

//   ngOnInit(): void {
//     this.userService.getUserProfile().pipe(
//       switchMap(user => {
//         this.user = user;
//         return this.userService.getOrderHistory(user.id);
//       }),
//       switchMap((orders: OrderResponse[]) => {
//         const enrichedOrderRequests = orders.map(order =>
//           forkJoin({
//             restaurant: this.restaurantService.getRestaurantById(order.restaurantId).pipe(
//               catchError(() => of({ name: 'Unknown Restaurant' }))
//             ),
//             items: forkJoin(
//               order.items.map(item =>
//                 this.restaurantService.getMenuItemById(order.restaurantId, item.productId).pipe(
//                   map(menuItem => ({
//                     name: menuItem.name,
//                     quantity: item.quantity
//                   })),
//                   catchError(() => of({
//                     name: 'Unknown Item',
//                     quantity: item.quantity
//                   }))
//                 )
//               )
//             )
//           }).pipe(
//             map(({ restaurant, items }) => ({
//               orderId: order.orderId,
//               status: order.status,
//               items,
//               restaurantName: restaurant.name,
//               orderTime: order.orderTime
//             }))
//           )
//         );

//         return forkJoin(enrichedOrderRequests);
//       })
//     ).subscribe({
//       next: (enriched) => {
//         this.enrichedOrders = enriched;
//         console.log('Enriched Orders:', enriched);
//       },
//       error: err => console.error('Failed to load order history:', err)
//     });
//   }

//   fetchOrderHistory(userId: number){
//     this.userService.getOrderHistory(userId).subscribe({
//       next: (orderData) => {
//         this.orders = orderData;
//         console.log("Order history: ", orderData);
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error("Failed to load order history ", err);
//         this.loading = false;
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { EnrichedOrder } from '../../models/enriched-order-response.model';
import { RestaurantService } from '../../services/restaurant.service';
import { OrderResponse } from '../../models/OrderResponse.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from '../../models/UserDTO.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  user!: UserDTO;
  enrichedOrders: EnrichedOrder[] = [];
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      this.loadUserAndOrders(); // custom method that does the full logic
    });
  }

  loadUserAndOrders() {
    this.userService.getUserProfile().pipe(
      switchMap(user => {
        this.user = user;
        return this.userService.getOrderHistory(user.id);
      }),
      switchMap((orders: OrderResponse[]) => {
        const enrichedOrderRequests = orders.map(order =>
          forkJoin({
            restaurant: this.restaurantService.getRestaurantById(order.restaurantId).pipe(
              map(dto => ({ id: dto.id, name: dto.name })),
              catchError(() => of({ id: order.restaurantId, name: 'Unknown Restaurant' }))
            ),
            items: forkJoin(
              order.items.map(item =>
                this.restaurantService.getMenuItemById(item.productId).pipe(
                  map(menuItem => ({
                    name: menuItem.name,
                    quantity: item.quantity
                  })),
                  catchError(() => of({
                    name: 'Unknown Item',
                    quantity: item.quantity
                  }))
                )
              )
            )
          }).pipe(
            map(({ restaurant, items }) => ({
              orderId: order.orderId,
              status: order.status,
              items,
              restaurantName: restaurant.name,
              orderTime: order.orderTime,
              deliveryAddress: order.deliveryAddress
            }))
          )
        );
        return forkJoin(enrichedOrderRequests);
      })
    ).subscribe({
      next: enriched => {
        this.enrichedOrders = enriched;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load order history:', err);
        this.loading = false;
      }
    });
  }

}
