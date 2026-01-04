import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // 🔑 LocalStorage key
  private storageKey = 'cart';

  // ✅ Initial cart load from LocalStorage
  private cartItems = signal<any[]>(
    JSON.parse(localStorage.getItem(this.storageKey) || '[]')
  );

  // ✅ Live cart count
  cartCount = computed(() => this.cartItems().length);

  constructor() {}

  // ➕ Add product
  addToCart(product: any): void {
    const updatedCart = [...this.cartItems(), product];
    this.cartItems.set(updatedCart);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCart));
  }

  // 📦 Get cart items
  getCartItems() {
    return this.cartItems;
  }

  // ❌ Remove single item
  removeFromCart(index: number): void {
    const updatedCart = this.cartItems().filter((_, i) => i !== index);
    this.cartItems.set(updatedCart);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCart));
  }

  // 🧹 Clear cart
  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem(this.storageKey);
  }
}
