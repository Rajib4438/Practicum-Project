import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: any[] = [];

  private apiUrl = 'https://localhost:7290/api/Product';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // =========================
  // LOAD PRODUCTS
  // =========================
  loadProducts(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: res => this.products = res,
      error: err => console.error('Error loading products', err)
    });
  }

  // =========================
  // IMAGE URL FIX
  // =========================
  getImageUrl(imageLocation: string): string {
    if (!imageLocation) {
      return 'assets/no-image.png';
    }

    if (imageLocation.startsWith('http')) {
      return imageLocation;
    }

    return 'https://localhost:7290/' + imageLocation;
  }

  // =========================
  // ADD TO CART
  // =========================
  addToCart(product: any): void {
    console.log('Added to cart:', product);
    alert(`${product.name} added to cart`);
  }
}
