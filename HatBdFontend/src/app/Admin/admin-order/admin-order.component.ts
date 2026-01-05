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
  filteredOrders: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';

  private API_URL = 'https://localhost:7290/api/Order';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ================= LOAD ORDERS =================
  loadOrders(): void {
    this.loading = true;
    this.http.get<any[]>(`${this.API_URL}/admin`).subscribe({
      next: (res) => {
        // Ensure orderItems exist
        this.orders = res.map(o => ({ ...o, orderItems: o.orderItems || [] }));
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: () => {
        alert('Failed to load orders');
        this.loading = false;
      }
    });
  }

  // ================= SEARCH ORDERS =================
  searchOrders(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(order =>
      order.id.toString().includes(q) || // Search by Order ID
      order.orderItems?.some((item: { productid: { toString: () => string | string[]; }; productname: string; }) =>
        (item.productid?.toString().includes(q)) ||
        (item.productname?.toLowerCase().includes(q))
      )
    );
  }

  // ================= UPDATE ORDER STATUS =================
  updateStatus(orderId: number, status: string): void {
    this.http.put(`${this.API_URL}/${orderId}/status`, { status }).subscribe({
      next: () => {
        alert('Order status updated');
        this.loadOrders();
      },
      error: () => alert('Failed to update order status')
    });
  }

  // ================= DELETE ORDER =================
  deleteOrder(orderId: number): void {
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.http.delete(`${this.API_URL}/${orderId}`).subscribe({
      next: () => {
        alert('Order deleted');
        this.loadOrders();
      },
      error: () => alert('Failed to delete order')
    });
  }

}
