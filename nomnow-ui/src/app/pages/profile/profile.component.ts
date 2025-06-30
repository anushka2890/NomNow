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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Address } from '../../models/address.model';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  user!: UserDTO;
  enrichedOrders: EnrichedOrder[] = [];
  loading: boolean = true;
  isEditing: boolean = false;
  profileForm!: FormGroup;
  totalOrders: number = 0;
  totalSpent: number = 0;
  addresses: any[] = []; 

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      this.loadUserAndOrders();
    });

    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: ['']
    });
    this.loadAddress();
  }

  saveChanges(): void {
    if (this.profileForm.invalid) return;

    const updatedUser: UserDTO = {
      ...this.user,
      ...this.profileForm.value
    };

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (res) => {
        this.user = res;
        this.toggleEdit(); // exit edit mode
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
      }
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
              deliveryAddress: order.deliveryAddress,
              totalAmount: order.totalAmount
            }))
          )
        );
        return forkJoin(enrichedOrderRequests);
      })
    ).subscribe({
      next: enriched => {
        this.enrichedOrders = enriched;
        this.totalOrders = enriched.length;
        this.totalSpent = enriched
                          .filter(order => order.status === 'PAYMENT_SUCCESS')
                          .reduce((sum, order) => sum + order.totalAmount, 0);
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load order history:', err);
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.setValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone
      });
    }
  }

  loadAddress(){
    this.addressService.getUserAddress().subscribe({
      next: (data) => this.addresses = Array.isArray(data) ? data : [data],
      error: (err) => console.error('Failed to load addresses', err)
    });
  }

  onDeleteAddress(id: number) {
    this.addressService.deleteAddress(id).subscribe(() => {
      this.addresses = this.addresses.filter(addr => addr.id !== id);
    });
  }
}
