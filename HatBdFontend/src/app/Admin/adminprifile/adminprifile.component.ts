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

   user: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User not logged in');
      return;
    }

    this.http.get(`https://localhost:7290/api/UserRegistration/profile/${userId}`)
      .subscribe({
        next: (res) => {
          this.user = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }
}
