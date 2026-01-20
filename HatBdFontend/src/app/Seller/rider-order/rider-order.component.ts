
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-assigned-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rider-order.component.html',
  styleUrls: ['./rider-order.component.css']
})
export class MyAssignedOrdersComponent implements OnInit {

  assignedOrders: any[] = [];
  riderId: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    debugger;
   }

  ngOnInit(): void {
    debugger;
    const userStr = localStorage.getItem('currentUser');
    debugger;
    if (userStr) {
      const user = JSON.parse(userStr);
      this.riderId = user.id || user.Id; // Handle case sensitivity
      this.loadOrders();
    }
  }

  loadOrders() {
    if (!this.riderId) return;

    this.http.get<any[]>(`https://localhost:7290/api/Order/rider/${this.riderId}`)
      .subscribe({
        next: (data) => {
          debugger;
          this.assignedOrders = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching rider orders:', err);
        }
      });
  }

  // Update status (Optional: If backend supports it, we'd call API here)
  updateStatus(order: any, newStatus: string) {
    // For now just local update, or call an API if required later
    order.status = newStatus;
  }

}
