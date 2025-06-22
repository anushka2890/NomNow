import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeaderComponent } from './shared/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeroComponent } from "./sections/hero/hero.component";
import { CategoryStripComponent } from './sections/category-strip/category-strip.component';
import { FeaturedRestaurantsComponent } from './sections/featured-restaurants/featured-restaurants.component';
@Component({
  selector: 'app-root',
  standalone: true, // this is the trick: this component is standalone
  imports: [RouterModule, HttpClientModule, HeaderComponent, MatSnackBarModule, NavbarComponent, HeroComponent, CategoryStripComponent, FeaturedRestaurantsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nomnow-ui';
}
