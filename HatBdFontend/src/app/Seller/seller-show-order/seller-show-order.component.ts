import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-show-order',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './seller-show-order.component.html',
  styleUrls: ['./seller-show-order.component.css']
})
export class ShowOrderComponent implements OnInit {



  sellerId: number = 0; // seller Id load from localStorage or auth
  orders: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  private apiUrl = 'https://localhost:7290/api/Order/seller'; // তোমার API URL

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // ধরছি sellerId localStorage এ আছে
    const storedSellerId = localStorage.getItem('userId');
    debugger
    if (storedSellerId) this.sellerId = +storedSellerId;

    if (this.sellerId > 0) {
      this.loadSellerOrders();
    } else {
      this.errorMessage = 'Seller ID not found. Please login again.';
    }
  }

  loadSellerOrders(): void {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/${this.sellerId}`).subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading seller orders:', err);
        this.errorMessage = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

}
