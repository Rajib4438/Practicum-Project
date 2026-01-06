import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCartItems();
  }

  // Load cart from backend
  loadCartItems() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    this.http.get(`https://localhost:7290/api/cart/${userId}`).subscribe({
      next: (res: any) => {
        // SP theke asha data mapping
        this.cartItems = res.map((item: any) => ({
          cartId: item.cartId,
          productId: item.productId,
          imageLocation: item.imageLocation,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity
        }));
        this.calculateTotal();
        this.cdr.detectChanges();
        console.log('Cart items loaded:', this.cartItems);
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  // Remove single item
  removeItem(index: number) {
    const cartId = this.cartItems[index].cartId;
    this.http.delete(`https://localhost:7290/api/cart/${cartId}`).subscribe({
      next: () => {
        this.cartItems.splice(index, 1);
        this.calculateTotal();
      },
      error: (err) => console.error('Error removing item:', err)
    });
  }

  // Clear all items
  clearCart() {
    const requests = this.cartItems.map(item =>
      this.http.delete(`https://localhost:7290/api/cart/${item.cartId}`)
    );

    Promise.all(requests.map(req => req.toPromise()))
      .then(() => {
        this.cartItems = [];
        this.totalPrice = 0;
      })
      .catch(err => console.error(err));
  }

  // Update quantity
  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity < 1) return;

    this.http.put(`https://localhost:7290/api/cart/${item.cartId}`, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.calculateTotal();
      },
      error: (err) => console.error('Error updating quantity:', err)
    });
  }

  // Calculate total price
  calculateTotal() {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }

  // Proceed to checkout
  proceedToOrder() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }
  onQtyAdd(item:any){
    this.http.get(`https://localhost:7290/api/Product/${item.productId}`).subscribe({
      next: (res: any) => {
        if(item.quantity < res.availableQuantity){
          alert('Quantity increased');  
        } else {
          alert('No more stock available');
        }
  }
  onQtyMinus(item:any){
    alert('Quantity decreased');
  }
}
