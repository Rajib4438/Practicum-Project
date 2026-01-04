import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {

  orders: any[] = [];
  loading: boolean = false;

  private API_URL = 'https://localhost:7290/api/Order';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ================= LOAD ORDERS (ADMIN) =================
  loadOrders(): void {
    this.loading = true;

    this.http.get<any[]>(`${this.API_URL}/admin`).subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load orders');
        this.loading = false;
      }
    });
  }

  // ================= UPDATE ORDER STATUS (FIXED) =================
  updateStatus(orderId: number, status: string): void {
    this.http.put(
      `${this.API_URL}/${orderId}/status`,
      { status }   // ✅ OBJECT পাঠানো হচ্ছে
    ).subscribe({
      next: () => {
        alert('Order status updated');
        this.loadOrders(); // refresh list
      },
      error: () => {
        alert('Failed to update order status');
      }
    });
  }

  // ================= DELETE ORDER =================
  deleteOrder(orderId: number): void {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    this.http.delete(`${this.API_URL}/${orderId}`).subscribe({
      next: () => {
        alert('Order deleted');
        this.loadOrders();
      },
      error: () => {
        alert('Failed to delete order');
      }
    });
  }
}
