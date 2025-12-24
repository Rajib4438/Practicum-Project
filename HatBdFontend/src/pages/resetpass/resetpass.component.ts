import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './resetpass.component.html'
})
export class ResetPasswordComponent implements OnInit {

  token: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  isError: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword(): void {

    if (!this.password || !this.confirmPassword) {
      this.isError = true;
      this.message = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.isError = true;
      this.message = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.http.post(
      'https://localhost:7290/api/user/reset-password',
      {
        token: this.token,
        password: this.password,
        confirmPassword: this.confirmPassword
      }
    ).subscribe((data:any)=>{
      this.loading = false;
      this.isError = false;
      this.message = 'Password has been reset successfully';
      this.router.navigate(['login']);
    },(error)=>{
      this.loading = false;
      this.isError = true;
      this.message = 'Failed to reset password. Please try again.';

    });
  }
}
