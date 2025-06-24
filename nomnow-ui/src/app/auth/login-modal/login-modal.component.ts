import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SignupModalComponent } from '../signup-modal/signup-modal.component';
import { AuthModalWrapperComponent } from '../auth-modal-wrapper/auth-modal-wrapper.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    AuthModalWrapperComponent
  ],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  loginForm: FormGroup;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // nothing needed here unless you want to set defaults
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        alert('Login successful!');
        this.dialogRef.close();
      },
      error: err => {
        this.loginError = 'Login failed. Please check your credentials.';
        console.error(err);
      }
    });
  }

  openSignup(): void {
    this.dialogRef.close();
    setTimeout(() => {
      this.dialog.open(SignupModalComponent, {
        width: '400px'
      });
    }, 200);
  }
}
