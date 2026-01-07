import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './My-Order.component.html',
  styleUrls: ['./My-Order.component.css']
})
export class OrderComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  errorMessage = '';

  private ORDER_API = 'https://localhost:7290/api/Order';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const user = this.getCurrentUser();
    if (!user) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.loadOrders(user.id);
  }

  getCurrentUser(): any {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '');
    } catch {
      return null;
    }
  }

  loadOrders(userId: number) {
    this.loading = true;

    this.http.get<any[]>(`${this.ORDER_API}/user/${userId}`).subscribe({
      next: res => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load orders';
        this.loading = false;
      }
    });
  }
}
