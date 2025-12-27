import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userform',
  standalone: true,                 // ✅ MUST (fixes line-8 error)
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.css']
})
export class Userform {

  // 🔴 তোমার API URL এখানে
  private apiUrl = 'https://localhost:7290/api/UserRegistration/create';

  user = {
    Id: '',
    Name: '',
    Email: '',
    Password: '',
    Phone: '',
    Address: '',
    Gender: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =========================
  // SAVE USER (API CALL)
  // =========================
  saveUser(): void {
    console.log('Sending to API:', this.user);

    this.http.post(this.apiUrl, {
      name: this.user.Name,
      email: this.user.Email,
      password: this.user.Password,
      phone: this.user.Phone,
      address: this.user.Address,
      gender: this.user.Gender
    }).subscribe({
      next: () => {
        alert('User saved successfully!');
        this.router.navigate(['/admin/users']); // list page
      },
      error: (err) => {
        console.error('API error', err);
        alert('Failed to save user');
      }
    });
  }

  // =========================
  // CANCEL
  // =========================
  cancel(): void {
    this.user = {
      Id: '',
      Name: '',
      Email: '',
      Password: '',
      Phone: '',
      Address: '',
      Gender: ''
    };
    this.router.navigate(['/admin/users']);
  }
}
