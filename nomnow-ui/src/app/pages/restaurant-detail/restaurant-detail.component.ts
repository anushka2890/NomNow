import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { MenuItem, Restaurant, RestaurantDTO } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css'
})
export class RestaurantDetailComponent implements OnInit {

  restaurant!: Restaurant;
  groupedMenu: { [category: string]: MenuItem[] } = {};
  categoryKeys: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (data) => {
        this.restaurant = data;
        this.groupedMenu = this.groupMenuItemsByCategory(data.menuItems);
        this.categoryKeys = Object.keys(this.groupedMenu);
      },
      error: (err) => console.error('Error loading restaurant', err)
    });
  }

  groupMenuItemsByCategory(menuItems: MenuItem[]): { [key: string]: MenuItem[] } {
    const grouped: { [key: string]: MenuItem[] } = {};
    for (const item of menuItems) {
      const category = item.category || 'Others';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    }
    return grouped;
  }

  addToCart(item: MenuItem): void {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: this.restaurant.id
    };
    this.cartService.setRestaurantId(this.restaurant.id);
    this.cartService.addToCart(cartItem);
    alert(`${item.name} added to cart`);
  }
}