import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { HeroComponent } from "../../sections/hero/hero.component";
import { CategoryStripComponent } from "../../sections/category-strip/category-strip.component";
import { FeaturedRestaurantsComponent } from "../../sections/featured-restaurants/featured-restaurants.component";
import { ExclusiveDealsComponent } from "../../sections/exclusive-deals/exclusive-deals.component";
import { HowItWorksComponent } from "../../sections/how-it-works/how-it-works.component";
import { RestaurantDTO } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, CategoryStripComponent, FeaturedRestaurantsComponent, ExclusiveDealsComponent, HowItWorksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  allRestaurants: RestaurantDTO[] = [];
  filteredRestaurants: any[] = [];
  popularRestaurants: any[] = [];

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.allRestaurants = data;
      this.popularRestaurants = data.filter(r => r.rating>=4.5);
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
      rest.menuItemDTOList?.some(item => item.name.toLowerCase().includes(lowerQuery))
    );
  }

  onRestaurantSelected(restaurant: any) {
    this.filteredRestaurants = []; // close dropdown
    this.router.navigate(['/restaurant', restaurant.id]);
  }

  filterByCategory(category: string) {
  console.log('Filter restaurants/menu by category:', category);
  // Example:
  this.filteredRestaurants = this.allRestaurants.filter(rest =>
    rest.menuItemDTOList.some(item => item.category === category)
  );
}
}
