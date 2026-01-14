import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-assigned-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rider-order.component.html',
  styleUrls: ['./rider-order.component.css']
})
export class MyAssignedOrdersComponent {

  // Demo data: Orders assigned to this rider
  assignedOrders = [
    { orderId: 'ORD-101', seller: 'Seller A', customer: 'Rahim', area: 'Mirpur', status: 'Pending' },
    { orderId: 'ORD-102', seller: 'Seller B', customer: 'Karim', area: 'Banani', status: 'On Delivery' },
    { orderId: 'ORD-103', seller: 'Seller A', customer: 'Hasan', area: 'Dhanmondi', status: 'Delivered' }
  ];

  // Update status
  updateStatus(order: any, newStatus: string) {
    order.status = newStatus;
  }

}
