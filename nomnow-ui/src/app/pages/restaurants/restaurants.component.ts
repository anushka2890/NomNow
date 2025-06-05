import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant';

import { HttpClientModule } from '@angular/common/http'; //

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
      this.restaurantService.getRestaurants().subscribe({
        next: (data: Restaurant[]) => {
          this.restaurants = data;
        }
      });
    }
}
