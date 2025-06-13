import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from '../../models/UserDTO.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!:UserDTO;
  userId = 3; // (hardcoded for now or get from auth service)
  editMode = false;
  successMessage: string = '';
  errorMessage :string = '';
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserById(this.userId).subscribe(data => {
      this.user = data;
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  // save(): void {
  //   this.userService.updateUser(this.user);
  //   this.toggleEdit();
  // }
  
  goToOrderHistory(): void {
    this.router.navigate(['/order-history']);
  }

  onSaveChanges() {
  if (this.user) {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (updated) => {
        this.user = updated;
        this.editMode = false;
        this.successMessage = 'Profile updated successfully!';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update profile.';
      }
    });
  }
}

}
