import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './sellerprofile.component.html',
  styleUrls: ['./sellerprofile.component.css']
})
export class SellerProfileComponent implements OnInit {

  seller: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const sellerId = localStorage.getItem('userId'); // Assuming sellerId is stored

    if (!sellerId) {
      console.error('Seller not logged in');
      this.loading = false;
      return;
    }

    // Replace with your actual API endpoint
    this.http.get(`https://localhost:7290/api/UserRegistration/seller-profile/${sellerId}`)
      .subscribe({
        next: (res) => {
          this.seller = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  logout(): void {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerId');
    window.location.href = '/seller/login'; // Redirect to seller login
  }
}
