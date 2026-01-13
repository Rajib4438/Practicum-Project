import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rider-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rider-layout.component.html',
  styleUrls: ['./rider-layout.component.css']
})
export class RiderDashboardComponent {

  // Only for demo
  assignedOrders = [
    { orderId: 'ORD-101', customer: 'Rahim', area: 'Mirpur', status: 'Pending' },
    { orderId: 'ORD-102', customer: 'Karim', area: 'Banani', status: 'On Delivery' },
    { orderId: 'ORD-103', customer: 'Hasan', area: 'Dhanmondi', status: 'Delivered' }
  ];

}
