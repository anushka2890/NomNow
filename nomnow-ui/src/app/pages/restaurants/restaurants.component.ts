import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant, MenuItem } from '../../models/restaurant';
import { MenuModalComponent } from '../../shared/menu-modal/menu-modal.component';
import { HttpClientModule } from '@angular/common/http'; //
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MenuModalComponent, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  selectedMenu: MenuItem[] = [];
  selectedRestaurant: string = '';
  showModal = false;
  loading = true;
  searchQuery : string = '';
  filteredRestaurants: Restaurant[] = [];
  selectedRestaurantId: number = 1; // Default restaurant

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
      this.restaurantService.getRestaurants().subscribe({
        next: (data) => {
          this.restaurants = data;
          this.filteredRestaurants = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching restaurants:', error);
          this.loading = false;
        }
      });
    }

    filterRestaurants() {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredRestaurants = this.restaurants.filter(r =>
        r.name.toLowerCase().includes(query)
      );
    }

    viewMenu(restaurant: Restaurant) {
      this.selectedMenu = restaurant.menuItems;
      this.selectedRestaurant = restaurant.name;
      this.selectedRestaurantId = restaurant.id;
      this.showModal = true;
    }

    closeModal = () => {
      this.showModal = false;
    };
}
