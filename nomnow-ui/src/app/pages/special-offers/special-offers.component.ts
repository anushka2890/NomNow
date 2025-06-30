import { Component, OnInit } from '@angular/core';
import { Offer } from '../../models/offer.model';
import { OfferService } from '../../services/offer.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-special-offers',
  imports: [CommonModule],
  templateUrl: './special-offers.component.html',
  styleUrl: './special-offers.component.css'
})
export class SpecialOffersComponent implements OnInit {
  offers: Offer[] = [];
  allOffers: Offer[] = [];
  categories: string[] = [];
  selectedCategory = '';

  constructor(private offerService: OfferService, private router: Router) {}

  ngOnInit(): void {
    this.offerService.getAllOffers().subscribe(data => {
      this.allOffers = data;
      this.offers = data;
      this.categories = [...new Set(data.map(o => o.category))]; // unique categories
    });
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const category = target.value;
    this.selectedCategory = category;

    this.offers = category
      ? this.allOffers.filter(o => o.category === category)
      : [...this.allOffers];
  }

  goToRestaurant(restaurantId: number|undefined) {
    this.router.navigate(['/restaurant', restaurantId]);
  }

}