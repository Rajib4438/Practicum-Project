import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-rider-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './rider-layout.component.html',
  styleUrls: ['./rider-layout.component.css']
})
export class RiderLayoutComponent {

  showProfileMenu = false;
assignedOrders: any;

  constructor(private http: HttpClient, private router: Router) {}

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Demo assigned orders
  // assignedOrders = [
  //   { orderId: 'ORD-101', customer: 'Rahim', area: 'Mirpur', status: 'Pending' },
  //   { orderId: 'ORD-102', customer: 'Karim', area: 'Banani', status: 'On Delivery' },
  //   { orderId: 'ORD-103', customer: 'Hasan', area: 'Dhanmondi', status: 'Delivered' }
  // ];

}
