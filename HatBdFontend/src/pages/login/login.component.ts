import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class Login {

  data: any = {
    userName: '',
    password: ''
  };

  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {

    if (!this.data.userName || !this.data.password) {
      alert('Please fill all fields');
      return;
    }

    this.isLoading = true;

    this.http.post<any>('https://localhost:7290/api/UserRegistration/login', this.data)
      .subscribe(
        (response) => {

          // ================================
          // 🔑 REQUIRED FOR CHECKOUT AUTO-FILL
          // ================================
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              id: response.id
            })
          );

          // ================================
          // 🔐 EXISTING CODE (UNCHANGED)
          // ================================
          localStorage.setItem('userId', response.id);
          localStorage.setItem('userToken', response.token || 'loggedin');
          localStorage.setItem(
            'userName',
            response.fullName || response.userName || this.data.userName
          );

          console.log('Login Success:', response);

          // ================================
          // 🔀 ADMIN REDIRECT (UNCHANGED)
          // ================================
          if (response.registerAs === 'Admin') {
            this.router.navigate(['/layout']).then(() => {
              window.location.reload();
            });
            return;
          }

          // seller redirect
          if (response.registerAs === 'Seller') {
            this.router.navigate(['/seller']).then(() => {
              window.location.reload();
            });
            return;
          }

          // ================================
          // 🔀 NORMAL USER REDIRECT (UNCHANGED)
          // ================================
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });

        },
        (err: HttpErrorResponse) => {
          alert('Login Failed! Invalid credentials.');
          this.isLoading = false;
        }
      );
  }

  onforget_password() {
    this.router.navigate(['forgotpass']);
  }
}
