import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true, // this is the trick: this component is standalone
  imports: [NavbarComponent, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nomnow-ui';
}
