import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './adminprifile.component.html',
  styleUrls: ['./adminprifile.component.css']
})
export class AdminProfileComponent implements OnInit {

  admin: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const adminId = localStorage.getItem('userId'); // assuming you store adminId in localStorage

    if (!adminId) {
      console.error('Admin not logged in');
      this.loading = false;
      return;
    }

    // Replace with your actual API endpoint if needed
    this.http.get(`https://localhost:7290/api/UserRegistration/admin-profile/${adminId}`)
      .subscribe({
        next: (res) => {
          this.admin = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    window.location.href = '/admin/login'; // redirect to admin login
  }
}
