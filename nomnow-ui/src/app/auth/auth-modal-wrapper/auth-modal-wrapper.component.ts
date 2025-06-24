import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-modal-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-modal-wrapper.component.html',
  styleUrls: ['./auth-modal-wrapper.component.css']
})
export class AuthModalWrapperComponent {
  @Input() bannerImageUrl: string = '';
}
