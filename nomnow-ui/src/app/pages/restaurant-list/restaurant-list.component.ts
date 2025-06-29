import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestaurantDTO } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
@Component({
  selector: 'app-restaurant-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit{
  restaurants: any[] = [];
  constructor(private restaurantService: RestaurantService){}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        // Add UI-specific dummy values
        this.restaurants = data.map(rest => ({
          ...rest,
          categories: ['North Indian', 'Biryani'],
          deliveryTime: Math.floor(Math.random() * 20) + 25
        }));
      },
      error: (err) => {
        console.error('Failed to load restaurants', err);
      }
    });
  }
}
