import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  steps = [
  {
    title: 'Browse Menu',
    description: 'Explore dishes from nearby restaurants and discover what you crave.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png'
  },
  {
    title: 'Place Your Order',
    description: 'Add items to your cart and confirm your order securely in seconds.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
  },
  {
    title: 'Track Delivery',
    description: 'Track your food in real-time and get it delivered hot & fresh.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'
  }
];

}
