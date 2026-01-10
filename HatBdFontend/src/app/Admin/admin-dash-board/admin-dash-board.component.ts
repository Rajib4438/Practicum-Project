import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-dash-board.component.html',
  styleUrls: ['./admin-dash-board.component.css']
})
export class AdminDashboardComponent {
  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
    this.loadOrders();
  }

  loadUsers() {
    this.http
      .get<any[]>('https://localhost:7290/api/UserRegistration/all')
      .subscribe({
        next: (res) => {
          this.totalUsers = res.length;
        },
        error: (err) => console.error('User API error', err)
      });
  }

  loadProducts() {
    this.http
      .get<any[]>('https://localhost:7290/api/Product')
      .subscribe({
        next: (res) => {
          this.totalProducts = res.length;
        },
        error: (err) => console.error('Product API error', err)
      });
  }

  loadOrders() {
    this.http
      .get<any[]>('https://localhost:7290/api/Order')
      .subscribe({
        next: (res) => {
          this.totalOrders = res.length;
        },
        error: (err) => console.error('Order API error', err)
      });
  }

}
