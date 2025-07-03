import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RestaurantDTO } from '../../models/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-restaurant-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit{
  restaurants: any[] = [];
  selectedCategory: string = '';
  allCategories: string[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.fetchRestaurants();
    });
  }

  fetchRestaurants(): void {
  this.restaurantService.getRestaurants().subscribe({
    next: (data) => {
      const categorySet = new Set<string>();

      data.forEach(res => {
        res.menuItemDTOList?.forEach((item: any) => {
          if (item.category) categorySet.add(item.category);
        });
      });

      this.allCategories = Array.from(categorySet).sort();

      // ✅ Only filter after categories are available
      let filtered = data;
      if (this.selectedCategory) {
        filtered = data.filter(res =>
          res.menuItemDTOList?.some(item =>
            item.category?.toLowerCase() === this.selectedCategory.toLowerCase()
          )
        );
      }

      this.restaurants = filtered.map(rest => ({
        ...rest,
        categories: rest.menuItemDTOList?.map((item: any) => item.category).filter(Boolean),
        deliveryTime: Math.floor(Math.random() * 20) + 25
      }));
    },
    error: (err) => {
      console.error('Failed to load restaurants', err);
    }
  });
}

  clearCategory(): void {
    this.selectedCategory = '';
    this.fetchRestaurants();
  }
  onCategoryChange(event: Event): void {
  const selected = (event.target as HTMLSelectElement).value;
  this.selectedCategory = selected;
  this.fetchRestaurants();
}
ngAfterViewInit(): void {
  if (this.selectedCategory) {
    setTimeout(() => {
      const el = document.getElementById('category-select');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}


}
