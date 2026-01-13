import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  isLoggedIn = false;
  invoiceOrderId: number | null = null;

  private _cartItems = signal<any[]>([]);
  cartItems = computed(() => this._cartItems());

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  customer = { fullName: '', phone: '', address: '' };

  showPayment = false;
  paymentMethod = '';
  mobileNumber = '';
  paymentCode = '';
  askForCode = false;
  processingPayment = false;
  paymentSuccess = false;

  private CART_API = 'https://localhost:7290/api/cart';
  private ORDER_API = 'https://localhost:7290/api/Order';
  private ORDER_ITEM_API = 'https://localhost:7290/api/OrderItem';
  private USER_API = 'https://localhost:7290/api/UserRegistration/all';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.getCurrentUser();
    if (!user) return;

    this.isLoggedIn = true;

    this.http.get<any[]>(`${this.CART_API}/${user.id}`).subscribe({
      next: data => {
        this._cartItems.set(
          data.map(item => ({
            cartId: item.cartId,
            productId: item.productId,
            productName: item.productName,
            price: Number(item.price),
            quantity: Number(item.quantity)
          }))
        );
        this.cdr.detectChanges();
      },
      error: err => console.error('Cart load failed', err)
    });

    this.http.get<any[]>(this.USER_API).subscribe({
      next: users => {
        const u = users.find(x => x.id === user.id);
        if (u) {
          this.customer.fullName = u.fullName || '';
          this.customer.phone = u.phone || '';
        }
      }
    });
  }

  getCurrentUser(): any {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '');
    } catch {
      return null;
    }
  }

  placeOrder(): void {
    if (!this.isLoggedIn) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.customer.fullName || !this.customer.phone || !this.customer.address) {
      alert('Please fill all required fields');
      return;
    }

    this.showPayment = true;
  }

  resetPaymentStep() {
    this.askForCode = false;
    this.paymentCode = '';
  }

  onSendPayment() {
    if (!this.paymentMethod || !this.mobileNumber) {
      alert('Enter payment details');
      return;
    }

    if (!this.askForCode) {
      this.askForCode = true;
      return;
    }

    this.makePayment();
  }

  makePayment() {
    const user = this.getCurrentUser();
    if (!user) return;

    this.processingPayment = true;

    setTimeout(() => {
      this.processingPayment = false;
      this.paymentSuccess = true;

      const orderPayload = {
        userId: user.id,
        name: this.customer.fullName,
        phoneNumber: this.customer.phone,
        address: this.customer.address,
        paymentMethod: this.paymentMethod,
        status: 'Paid',
        totalPrice: this.totalPrice(),
        totalDiscount: 0,
        cartIds: this.cartItems().map(item => item.cartId)
      };

      this.http.post<any>(this.ORDER_API, orderPayload).subscribe({
        next: res => {
        
              // this.router.navigate([res.paymentUrl])
             window.open(res.data.paymentUrl, '_blank');
          const orderId = res?.orderId || res?.OrderId;
          if (!orderId) {
            alert('Order ID error');
            return;
          }

          // ✅ FIX: invoiceOrderId SET করা হলো
          this.invoiceOrderId = orderId;

          const items = this.cartItems().map(item => ({
            orderId,
            ProductId: item.productId,
            ProductName: item.productName,
            Price: item.price,
            Quantity: item.quantity
          }));

          this.http.post(this.ORDER_ITEM_API, items).subscribe({
            next: () => {
             
              alert(`Payment via ${this.paymentMethod} successful`);
            },
            error: () => alert('Payment Successful')
          });
        },
        error: () => alert('Order save failed')
      });

    }, 1500);
  }

  // ================= INVOICE PDF =================
  downloadInvoice(orderId: number | string) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('INVOICE', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Invoice No: ${orderId}`, 14, 30);
    doc.text(`Customer Name: ${this.customer.fullName}`, 14, 38);
    doc.text(`Phone: ${this.customer.phone}`, 14, 46);
    doc.text(`Address: ${this.customer.address}`, 14, 54);
    doc.text(`Payment Method: ${this.paymentMethod}`, 14, 62);

    let y = 74;
    doc.text('Items:', 14, y);

    this.cartItems().forEach((item, i) => {
      y += 8;
      doc.text(
        `${i + 1}. ${item.productName} - ${item.quantity} × ${item.price} = ${item.quantity * item.price} ৳`,
        14,
        y
      );
    });

    y += 12;
    doc.text(`Total: ${this.totalPrice()} ৳`, 14, y);

    doc.save(`Invoice_${orderId}.pdf`);
  }
}
