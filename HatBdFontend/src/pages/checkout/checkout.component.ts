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

  // 🔐 Login status
  isLoggedIn = false;

  // 🛒 Cart items
  cartItems = computed(() => this.cartService.getCartItems()());

  // 💰 Total price
  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price || 0), 0)
  );

  // 🧾 Customer info (AUTO FILL হবে)
  customer = {
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash'
  };

  // 🌐 APIs
  private ORDER_API = 'https://localhost:7290/api/Order';
  private ORDER_ITEM_API = 'https://localhost:7290/api/OrderItem';
  private USER_API = 'https://localhost:7290/api/UserRegistration/all';

  constructor(
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ===============================
  // 🔄 PAGE LOAD হলে USER AUTO FILL
  // ===============================
  ngOnInit(): void {
  console.log('Checkout ngOnInit called');

  const currentUser = this.getCurrentUser();
  console.log('Current user from localStorage:', currentUser);

  if (!currentUser) {
    this.isLoggedIn = false;
    return;
  }

  this.isLoggedIn = true;

  this.http.get<any[]>(this.USER_API).subscribe({
    next: (users) => {
      console.log('Fetched users:', users);

      const matchedUser = users.find(u => u.id === currentUser.id);
      console.log('Matched user:', matchedUser);

      if (matchedUser) {
        this.customer.fullName = matchedUser.fullName || '';
        this.customer.phone = matchedUser.phone || '';
      }
        this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to load user info', err);
    }
  });
}


  // ===============================
  // 🔐 GET CURRENT USER FROM localStorage
  // ===============================
  getCurrentUser(): any | null {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // ===============================
  // 🛒 PLACE ORDER
  // ===============================
  placeOrder(): void {

    const user = this.getCurrentUser();

    if (!user) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.customer.fullName || !this.customer.phone || !this.customer.address) {
      alert('Please fill all required fields');
      return;
    }

    // 1️⃣ CREATE ORDER
    const orderPayload = {
      userId: user.id,
      name: this.customer.fullName,
      phoneNumber: this.customer.phone,
      address: this.customer.address,
      paymentMethod: this.customer.paymentMethod,
      status: 'Pending',
      totalPrice: this.totalPrice(),
      totalDiscount: 0
    };

    this.http.post<any>(this.ORDER_API, orderPayload).subscribe({
      next: (res) => {
        const orderId = res?.orderId || res?.OrderId;

        if (!orderId) {
          alert('Order ID not returned');
          return;
        }

        // 2️⃣ CREATE ORDER ITEMS
        const orderItemsPayload = this.cartItems().map(item => ({
          orderId: orderId,
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: 1
        }));

        this.http.post(this.ORDER_ITEM_API, orderItemsPayload).subscribe({
          next: () => {
            alert('Order placed successfully!');
            this.cartService.clearCart();
            this.router.navigate(['/order-success', orderId]);
          },
          error: () => {
            alert('Order placed Successfully.');
          }
        });
      },
      error: () => {
        alert('Failed to place order');
      }
    });
  }
}
