import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeaderComponent } from './shared/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeroComponent } from "./sections/hero/hero.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { CategoryStripComponent } from './sections/category-strip/category-strip.component';
import { FeaturedRestaurantsComponent } from './sections/featured-restaurants/featured-restaurants.component';
import { ExclusiveDealsComponent } from "./sections/exclusive-deals/exclusive-deals.component";
import { HowItWorksComponent } from "./sections/how-it-works/how-it-works.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { CartUiService } from './services/cart-ui.service';
import { CartSidebarComponent } from "./shared/cart-sidebar/cart-sidebar.component";
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true, // this is the trick: this component is standalone
  imports: [RouterModule, HttpClientModule,
    HeaderComponent, MatSnackBarModule,
    NavbarComponent, HeroComponent,
    NgIf,         // for *ngIf
    AsyncPipe,    // for | async
    CategoryStripComponent,
    FeaturedRestaurantsComponent,
    ExclusiveDealsComponent,
    HowItWorksComponent,
    FooterComponent, CartSidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nomnow-ui';
  showCartSidebar$!: Observable<boolean>;

  constructor(public cartUiService: CartUiService) {}

  ngOnInit(): void {
    this.showCartSidebar$ = this.cartUiService.sidebarVisible$;
  }
}
