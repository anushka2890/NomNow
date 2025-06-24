import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { HeroComponent } from "../../sections/hero/hero.component";
import { CategoryStripComponent } from "../../sections/category-strip/category-strip.component";
import { FeaturedRestaurantsComponent } from "../../sections/featured-restaurants/featured-restaurants.component";
import { ExclusiveDealsComponent } from "../../sections/exclusive-deals/exclusive-deals.component";
import { HowItWorksComponent } from "../../sections/how-it-works/how-it-works.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, CategoryStripComponent, FeaturedRestaurantsComponent, ExclusiveDealsComponent, HowItWorksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
