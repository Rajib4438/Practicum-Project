import { ChangeDetectorRef, Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../app/Services/app.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // ================= BASIC =================
  isLoggedIn = false;

  cartItems = computed(() => this.cartService.getCartItems()());

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price || 0), 0)
  );

  customer = {
    fullName: '',
    phone: '',
    address: ''
  };

  // ================= PAYMENT =================
  showPayment = false;
  paymentMethod = '';
  mobileNumber = '';
  paymentCode = '';
  askForCode = false;
  processingPayment = false;
  paymentSuccess = false;

  // ================= API =================
  private ORDER_API = 'https://localhost:7290/api/Order';
  private ORDER_ITEM_API = 'https://localhost:7290/api/OrderItem';
  private USER_API = 'https://localhost:7290/api/UserRegistration/all';

  constructor(
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    const user = this.getCurrentUser();
    if (!user) return;

    this.isLoggedIn = true;

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

  // ================= PLACE ORDER (NO DB SAVE) =================
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

    // ❗ ONLY SHOW PAYMENT
    this.showPayment = true;
  }

  // ================= PAYMENT FLOW =================
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

  // ================= REAL SAVE AFTER PAYMENT =================
  makePayment() {
    const user = this.getCurrentUser();
    if (!user) return;

    this.processingPayment = true;

    setTimeout(() => {
      this.processingPayment = false;
      this.paymentSuccess = true;

      // 🔥 ORDER SAVE
      const orderPayload = {
        userId: user.id,
        name: this.customer.fullName,
        phoneNumber: this.customer.phone,
        address: this.customer.address,
        paymentMethod: this.paymentMethod,
        status: 'Paid',
        totalPrice: this.totalPrice(),
        totalDiscount: 0
      };

      this.http.post<any>(this.ORDER_API, orderPayload).subscribe({
        next: res => {
          const orderId = res?.orderId || res?.OrderId;
          if (!orderId) {
            alert('Order ID error');
            return;
          }

          // 🔥 ORDER ITEMS SAVE
          const items = this.cartItems().map(item => ({
            orderId,
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: 1
          }));

          this.http.post(this.ORDER_ITEM_API, items).subscribe({
            next: () => {
              alert(`Payment via ${this.paymentMethod} successful`);
              this.cartService.clearCart();
              this.router.navigate(['/home']);
            },
            error: () => alert('Payment Successful')
          });
        },
        error: () => alert('Order save failed')
      });

    }, 1500);
  }
}
