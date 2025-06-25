import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../models/UserDTO.model';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css']
})
export class ProfileSidebarComponent {

  @Input() user!: UserDTO; // <-- ADD THIS
  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  handleClose(): void {
    this.close.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    window.location.reload();
  }

  getUserInitial(): string {
    return this.user?.name ? this.user.name.charAt(0).toUpperCase() : 'U';
  }
    goToProfile() {
  console.log('Navigating to profile...');
  this.router.navigate(['/profile']).then(success => {
    console.log('Navigation success:', success);
  }).catch(err => {
    console.error('Navigation error:', err);
  });
  this.handleClose();
}
test() {
  console.log('Test button clicked!');
}

}
