import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItemDTO } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
import { map } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-exclusive-deals',
  imports: [CommonModule],
  templateUrl: './exclusive-deals.component.html',
  styleUrl: './exclusive-deals.component.css'
})
export class ExclusiveDealsComponent implements OnInit{
  exclusiveDeals : {
    item: MenuItemDTO;
    restaurantName: string;
    restaurantId: number;
  }[] = [];
  constructor(
    private restaurantService: RestaurantService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
      this.restaurantService.getRestaurants().subscribe(restaurants => {
        this.exclusiveDeals = [];
        restaurants.forEach(r => {
          const restaurantName = r.name;
          const restaurantId = r.id;
          r.menuItemDTOList.forEach((item: MenuItemDTO) => {
            if(item.offer){
              this.exclusiveDeals.push({item, restaurantName, restaurantId});
            }
          });
        });
      });
  }
  addToCart(item: MenuItemDTO, restaurantId: number): void {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: restaurantId,
      category: item.category,
      offer: item.offer ?? null
    };

    this.cartService.setRestaurantId(restaurantId);
    this.cartService.addToCart(cartItem);
  }
}
