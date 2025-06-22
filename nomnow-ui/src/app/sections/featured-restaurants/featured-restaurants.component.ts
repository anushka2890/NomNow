import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-featured-restaurants',
  imports: [FormsModule, CommonModule],
  templateUrl: './featured-restaurants.component.html',
  styleUrl: './featured-restaurants.component.css'
})
export class FeaturedRestaurantsComponent {
  restaurants = [
  {
    name: 'McDonald\'s',
    logo: 'https://1000logos.net/wp-content/uploads/2017/03/McDonalds-logo.png'
  },
  {
    name: 'KFC',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/KFC_logo.svg'
  },
  {
    name: 'Domino\'s',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg'
  },
  {
    name: 'Burger King',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/320px-Burger_King_2020.svg.png'
  },
  {
    name: 'Subway',
    logo: 'https://images.seeklogo.com/logo-png/28/1/subway-logo-png_seeklogo-287365.png'
  }
];

}
