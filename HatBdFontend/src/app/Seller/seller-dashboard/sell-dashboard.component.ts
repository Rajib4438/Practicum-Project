import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sell-dashboard.component.html',
  styleUrls: ['./sell-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {

  // 👉 product list
  products: any[] = [];

  totalOrders = 0;
  pendingOrders = 0;
  totalEarnings = 0;

  sellerId!: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.sellerId = Number(localStorage.getItem('sellerId'));
    this.loadProducts();
  }

  loadProducts() {
    this.http
      .get<any[]>(`https://localhost:7290/api/Product?sellerId=${this.sellerId}`)
      .subscribe({
        next: (res) => {
          console.log('Seller products', res);

          this.products = res;               // ✅ array assign
          this.totalOrders = 0;              // later API
          this.pendingOrders = res.filter(p => p.status === 'Pending').length; // ✅
          this.totalEarnings = 0;             // later API
        },
        error: (err) => {
          console.error('Dashboard API error', err);
        }
      });
  }
}
