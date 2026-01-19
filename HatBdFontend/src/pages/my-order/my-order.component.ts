import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
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

  constructor(private http: HttpClient) { }

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

  public downloadInvoice(order: any): void {
    const doc = new jsPDF();

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('INVOICE', 105, 20, { align: 'center' });

    // -- Brand / Company Name --
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('HatBD eCommerce', 105, 30, { align: 'center' });

    // -- Divider Line --
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    // -- Order Details --
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const leftColX = 20;
    const valueX = 70;
    let currentY = 50;
    const lineHeight = 10;

    // Order ID
    doc.setFont('helvetica', 'bold');
    doc.text('Order ID:', leftColX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(order.id), valueX, currentY);

    currentY += lineHeight;

    // Date
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', leftColX, currentY);
    doc.setFont('helvetica', 'normal');
    // Simple date formatting
    const dateStr = new Date(order.createdat).toLocaleDateString() + ' ' + new Date(order.createdat).toLocaleTimeString();
    doc.text(dateStr, valueX, currentY);

    currentY += lineHeight;

    // Payment Method
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', leftColX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(order.paymentmethod || 'N/A', valueX, currentY);

    currentY += lineHeight;

    // Address
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', leftColX, currentY);
    doc.setFont('helvetica', 'normal');
    const splitAddress = doc.splitTextToSize(order.address || 'N/A', 120);
    doc.text(splitAddress, valueX, currentY);

    // Adjust Y based on address lines
    currentY += (splitAddress.length * 7) + 5;

    // -- Divider Line --
    doc.line(20, currentY, 190, currentY);
    currentY += 15;

    // -- Total Amount --
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', leftColX, currentY);
    doc.text(`${order.totalprice} Taka`, 190, currentY, { align: 'right' });

    // -- Footer --
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for shopping with HatBD!', 105, 280, { align: 'center' });

    // Save PDF
    doc.save(`invoice_order_${order.id}.pdf`);
  }
}
