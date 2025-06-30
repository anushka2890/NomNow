import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-restaurants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-restaurants.component.html',
  styleUrl: './featured-restaurants.component.css'
})
export class FeaturedRestaurantsComponent implements OnChanges {
  @Input() restaurants: any[] = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['restaurants']) {
      console.log('Updated Featured Restaurants:', this.restaurants);
      this.cdr.detectChanges(); // force re-check
    }
  }

  goToRestaurant(id: number) {
    this.router.navigate(['/restaurant', id]);
  }
}
