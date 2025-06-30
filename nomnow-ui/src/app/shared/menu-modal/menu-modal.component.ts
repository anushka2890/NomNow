import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { MenuItem } from '../../models/restaurant';
@Component({
  selector: 'app-menu-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.css']
})
export class MenuModalComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() restaurantName: string = '';
  @Input() restaurantId!: number;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  addToCart(item: MenuItem) {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: this.restaurantId,
      category: item.category
    };
    this.cartService.addToCart(cartItem);
    this.cartService.setRestaurantId(this.restaurantId);
  }
}
