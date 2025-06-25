import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../../auth/login-modal/login-modal.component';
import { CartUiService } from '../../services/cart-ui.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';
import { ProfileSidebarComponent } from "../profile-sidebar/profile-sidebar.component";
import { User, UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],  // <-- note "styleUrls" (not "styleUrl")
  imports: [RouterModule, CommonModule, ProfileSidebarComponent]
})
export class NavbarComponent implements OnInit{
  isLoggedIn$!: Observable<boolean>;
  showProfileSidebar = false;
  user?: User;
  cartItemCount: number = 0;

  constructor(private dialog: MatDialog
    , private cartUiService: CartUiService
    , private authService: AuthService
    , private userService: UserService
    , private router: Router
    , private cartService: CartService ) {}

  ngOnInit(): void {

    this.cartService.getCart().subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
    
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    // ✅ Fetch user only if logged in
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.userService.getUserProfile().subscribe({
          next: (data) => this.user = data,
          error: (err) => console.error('Failed to fetch user info', err)
        });
      } else {
        this.user = undefined;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  openLogin(): void {
    this.dialog.open(LoginModalComponent, {
      width: '400px'
    });
  }
  openCart() {
    this.cartUiService.open();
  }

  toggleProfileSidebar(): void {
    console.log('Avatar clicked, sidebar toggled');
    this.showProfileSidebar = !this.showProfileSidebar;
  }

  trackLastOrder() {
  this.authService.isLoggedIn$.pipe(take(1)).subscribe(loggedIn => {
    if (!loggedIn) {
      alert('Please log in to track your orders.');
      return;
    }

    const orderId = localStorage.getItem('lastOrderId');
    if (orderId) {
      this.router.navigate(['/order-status', orderId]);
    } else {
      alert('No recent order found.');
    }
  });
}

}
