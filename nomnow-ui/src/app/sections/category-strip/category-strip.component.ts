import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category-strip',
  imports: [FormsModule, CommonModule],
  templateUrl: './category-strip.component.html',
  styleUrl: './category-strip.component.css',
  standalone: true,
})
export class CategoryStripComponent implements OnInit{
  @Output() categorySelected = new EventEmitter<string>();

  categories: string[] =[];
  constructor(private restService: RestaurantService, private router: Router){}

  ngOnInit(): void {
      this.restService.getRestaurants().subscribe(restaurants => {
        const categorySet = new Set<string>();
        restaurants.forEach(r => {
          r.menuItemDTOList.forEach(item => {
            if(item.category){
              categorySet.add(item.category.trim());
              console.log(item.category);
            }
          });
        });
        this.categories = Array.from(categorySet);
      });
      console.log("categories:", this.categories);
  }
  onCategoryClick(category: string) {
    this.router.navigate(['/restaurants'], { queryParams: { category } });
  }
  // onCategoryClick(category: string): void {
  //   console.log('Clicked category:', category);
  //   this.categorySelected.emit(category);
  //   // TODO: Navigate or filter based on selected category
  // }

//   categories = [
//   {
//     name: 'Burgers & Fast Food',
//     image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&h=140'
//   },
//   {
//     name: 'Salads',
//     image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&h=140'
//   },
//   {
//     name: 'Pizza',
//     image: 'https://images.pexels.com/photos/4109134/pexels-photo-4109134.jpeg?auto=compress&cs=tinysrgb&h=140'
//   },
//   {
//     name: 'Pasta',
//     image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&h=140'
//   },
//   {
//     name: 'Sushi',
//     image: 'https://images.pexels.com/photos/3577565/pexels-photo-3577565.jpeg?auto=compress&cs=tinysrgb&h=140'
//   },
//   {
//     name: 'Breakfast',
//     image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&h=140'
//   }
// ];



}
