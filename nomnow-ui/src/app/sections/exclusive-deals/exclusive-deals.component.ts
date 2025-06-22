import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-exclusive-deals',
  imports: [CommonModule],
  templateUrl: './exclusive-deals.component.html',
  styleUrl: './exclusive-deals.component.css'
})
export class ExclusiveDealsComponent {
deals = [
  {
    name: 'Veg Loaded Pizza',
    restaurant: 'Domino’s',
    price: 199,
    discount: '-30%',
    image: 'https://images.pexels.com/photos/4109134/pexels-photo-4109134.jpeg?auto=compress&cs=tinysrgb&h=160'
  },
  {
    name: 'Chicken Zinger Burger',
    restaurant: 'KFC',
    price: 149,
    discount: '-20%',
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&h=160'
  },
  {
    name: 'Paneer Wrap',
    restaurant: 'Subway',
    price: 129,
    discount: '-25%',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&h=160'
  },
  {
    name: 'Pasta Alfredo',
    restaurant: 'Big Bowl Co.',
    price: 179,
    discount: '-15%',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&h=160'
  }
];

}
