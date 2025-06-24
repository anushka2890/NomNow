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
//   rest = [
//   {
//     id:1,
//     name: 'McDonald’s',
//     imageUrl: 'https://1000logos.net/wp-content/uploads/2017/03/McDonalds-logo.png',
//     rating: 4.2,
//     deliveryTime: 25,
//     categories: ['Burgers', 'Fries', 'Cold Drinks']
//   },
//   {
//     id:2,
//     name: 'Subway',
//     imageUrl: 'https://images.seeklogo.com/logo-png/28/1/subway-logo-png_seeklogo-287365.png',
//     rating: 4.0,
//     deliveryTime: 20,
//     categories: ['Subs', 'Salads']
//   },
//   {
//     id:3,
//     name: 'Domino’s Pizza',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg',
//     rating: 4.1,
//     deliveryTime: 30,
//     categories: ['Pizza', 'Sides']
//   }
// ];

}
