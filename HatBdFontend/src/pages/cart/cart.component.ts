import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../app/Services/app.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartItems = computed(() => this.cartService.getCartItems()());

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price || 0), 0)
  );

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  // ✅ THIS METHOD WILL GO TO CHECKOUT
  proceedToOrder(): void {
    if (this.cartItems().length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
