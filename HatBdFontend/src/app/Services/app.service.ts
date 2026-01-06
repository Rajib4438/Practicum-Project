import { Injectable, signal, computed } from '@angular/core';
import { HttpClientConnectionService } from '../../services/HttpClientConnectionService';
import { HttpClient } from '@angular/common/http';

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

  constructor( private http: HttpClient,) {}

  // ➕ Add product
  addToCart(product: any): void {
    var user = Number(localStorage.getItem('userId'));
    if(!user){
      alert('Please login to add products to cart.');
      return;
    }


    var data = {
      cartId :0,
      userId:user,
      productId:product.id,
      quantity:1
    }
    this.http.post('https://localhost:7290/api/Cart',data).subscribe((res:any)=>{
      console.log('Product added to cart on server:', res);
    });

   
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
