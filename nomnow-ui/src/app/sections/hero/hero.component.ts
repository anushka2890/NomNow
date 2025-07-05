import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RestaurantDTO } from '../../models/restaurant';

@Component({
  selector: 'app-hero',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  searchControl = new FormControl<string>('');

  @Input() filteredRestaurants: any[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() restaurantSelected = new EventEmitter<any>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => this.search.emit(query ?? ''));
  }

onSearchClick(): void {
  const query = this.searchControl.value ?? '';
  this.search.emit(query); // emits to the parent (HomeComponent)
}
  onOptionClick(restaurant: any) {
    this.restaurantSelected.emit(restaurant);
  }
  getMatchedMenuItem(restaurant: RestaurantDTO): string | null {
  const query = this.searchControl.value?.toLowerCase();
  if (!query) return null;

  const match = restaurant.menuItemDTOList?.find((item: any) =>
    item.name.toLowerCase().includes(query)
  );
  return match ? match.name : null;
}

}
