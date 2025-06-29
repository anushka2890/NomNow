import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { HeroComponent } from "../../sections/hero/hero.component";
import { CategoryStripComponent } from "../../sections/category-strip/category-strip.component";
import { FeaturedRestaurantsComponent } from "../../sections/featured-restaurants/featured-restaurants.component";
import { ExclusiveDealsComponent } from "../../sections/exclusive-deals/exclusive-deals.component";
import { HowItWorksComponent } from "../../sections/how-it-works/how-it-works.component";
import { Restaurant, RestaurantDTO } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, CategoryStripComponent, FeaturedRestaurantsComponent, ExclusiveDealsComponent, HowItWorksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  allRestaurants: Restaurant[] = [];
  filteredRestaurants: any[] = [];

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.allRestaurants = data;
    });
  }

    onSearch(query: string) {
    if (!query || query.trim() === '') {
      this.filteredRestaurants = [];
      return;
    }

    const lowerQuery = query.toLowerCase();

    this.filteredRestaurants = this.allRestaurants.filter(rest =>
      rest.name.toLowerCase().includes(lowerQuery) ||
      rest.menuItems?.some(item => item.name.toLowerCase().includes(lowerQuery))
    );
  }

  onRestaurantSelected(restaurant: any) {
    this.filteredRestaurants = []; // close dropdown
    this.router.navigate(['/restaurant', restaurant.id]);
  }
}
