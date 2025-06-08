import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],  // <-- note "styleUrls" (not "styleUrl")
  imports:[RouterModule]
})
export class NavbarComponent {}
