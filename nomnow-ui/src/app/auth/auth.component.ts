import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLogin = true;
  email = '';
  password = '';

  constructor(private http:HttpClient, private router: Router){}

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    const url = this.isLogin
      ? 'http://localhost:8080/api/users/login'
      : 'http://localhost:8080/api/users/register';

    const body = { email: this.email, password: this.password };

    this.http.post<{ token: string }>(url, body).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Store the JWT token
        alert('Success!');
        this.router.navigate(['/']); // Navigate to homepage or dashboard
      },
      error: () => alert('Authentication failed. Check credentials.')
    });
  }

}
