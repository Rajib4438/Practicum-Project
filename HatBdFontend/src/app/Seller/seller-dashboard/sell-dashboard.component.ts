import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // 🔧 FIX: sellerId safe read (ager code remove kori nai)
    this.sellerId = Number(
      localStorage.getItem('sellerId') || localStorage.getItem('userId')
    ) || 0;

    this.loadProducts();
  }

  loadProducts() {
    this.http
      .get<any[]>(`https://localhost:7290/api/Product?sellerId=${this.sellerId}`)
      .subscribe({
        next: (res) => {
          console.log('Seller products', res);

          this.products = res;             
          this.cdr.detectChanges();

          // 🔹 total orders
          this.totalOrders = res.length;

          // 🔹 pending orders (ager logic unchanged)
          this.pendingOrders = res.filter(p => p.status === 'Pending').length;

          // 🔹 FIX: total earnings calculation (NEW)
          this.totalEarnings = res
            .reduce((sum, p) => {
              const price = Number(p.price) || 0;
              const qty = Number(p.stockquantity) || 1;
              return sum + (price * qty);
            }, 0);
        },
        error: (err) => {
          console.error('Dashboard API error', err);
        }
      });
  }
}
