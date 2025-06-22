import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-category-strip',
  imports: [FormsModule, CommonModule],
  templateUrl: './category-strip.component.html',
  styleUrl: './category-strip.component.css'
})
export class CategoryStripComponent {
  categories = [
  {
    name: 'Burgers & Fast Food',
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&h=140'
  },
  {
    name: 'Salads',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&h=140'
  },
  {
    name: 'Pizza',
    image: 'https://images.pexels.com/photos/4109134/pexels-photo-4109134.jpeg?auto=compress&cs=tinysrgb&h=140'
  },
  {
    name: 'Pasta',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&h=140'
  },
  {
    name: 'Sushi',
    image: 'https://images.pexels.com/photos/3577565/pexels-photo-3577565.jpeg?auto=compress&cs=tinysrgb&h=140'
  },
  {
    name: 'Breakfast',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&h=140'
  }
];



}
