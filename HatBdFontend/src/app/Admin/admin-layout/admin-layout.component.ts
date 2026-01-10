import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;

  constructor(private http: HttpClient) {}

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
