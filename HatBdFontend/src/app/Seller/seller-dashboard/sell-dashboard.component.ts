import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sell-dashboard.component.html',
  styleUrls: ['./sell-dashboard.component.css']
})
export class SellerDashboardComponent {

  // BASIC SUMMARY DATA (later API থেকে আনবে)
  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  totalEarnings = 0;

}
