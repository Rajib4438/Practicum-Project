import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // CART
  count = signal<number>(0);

  // 🔍 GLOBAL SEARCH TEXT
  searchText = signal<string>('');

  setSearch(text: string) {
    this.searchText.set(text);
  }

  setSearchText(searchText: string) {
    throw new Error('Method not implemented.');
  }
latestQty:number =0;
  // 🔑 LocalStorage key
  private storageKey = 'cart';

  // 🛒 Cart items (Signal)
  private cartItems = signal<any[]>(
    JSON.parse(localStorage.getItem(this.storageKey) || '[]')
  );

  // 🔢 Live cart count
  cartCount = computed(() => this.cartItems().length);

  constructor(private http: HttpClient) {}

  // ➕ Add product to cart (FIXED)
  addToCart(product: any): void {
    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      alert('Please login to add products to cart.');
      return;
    }
debugger;


if(product.stockquantity <= 0) {
      alert("Product is out of stock.");
      return;
    }
    if(product.stockquantity <= this.latestQty) {
      alert("You have reached the maximum available stock for this product in your cart.");
      return;
    }
    // 🌐 Save to server
this.http.post('https://localhost:7290/api/Cart', {
  cartId: 0,
  userId: userId,
  productId: product.id,
  quantity:  1
}).subscribe({
  next: (res:any) => {
    if(res.data.ProductId == product.id) {
     
    this.latestQty = res.data.Quantity;}
  },
  error: err => console.error('Server error:', err)
});
  }

  // 📦 Get cart items (Signal)
  getCartItems() {
    return this.cartItems;
  }

  // ❌ Remove item by index
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
