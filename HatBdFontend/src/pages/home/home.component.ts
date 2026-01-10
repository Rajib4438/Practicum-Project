import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../app/Services/app.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  bannerImages = [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
    'https://images.unsplash.com/photo-1472851294608-4155f2118c03?w=1200'
  ];

  slideIndex = 0;
  sliderInterval: any;

  isModalOpen = false;
  isSignup = false;

  searchText: string = '';
  allProducts: any[] = [];
  products: any[] = [];

  private productApi = 'https://localhost:7290/api/Product/approved';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {
    // ✅ CORRECT PLACE FOR EFFECT
    effect(() => {
      const text = this.cartService.searchText().toLowerCase().trim();

      if (!text) {
        this.products = this.allProducts;
        return;
      }

      this.products = this.allProducts.filter(p =>
        (p.name && p.name.toLowerCase().includes(text)) ||
        (p.brand && p.brand.toLowerCase().includes(text)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(text))
      );
    });
  }

  ngOnInit(): void {
    this.startSlider();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  startSlider(): void {
    this.sliderInterval = setInterval(() => this.nextSlide(), 5000);
  }

  nextSlide(): void {
    this.slideIndex = (this.slideIndex + 1) % this.bannerImages.length;
  }

  prevSlide(): void {
    this.slideIndex =
      this.slideIndex === 0
        ? this.bannerImages.length - 1
        : this.slideIndex - 1;
  }

  loadProducts(): void {
    this.http.get<any[]>(this.productApi).subscribe({
      next: res => {
        this.allProducts = res;
        this.products = res;
      },
      error: err => console.error('Error loading products', err)
    });
  }

  getImageUrl(imageLocation: string): string {
    if (!imageLocation) return 'assets/no-image.png';
    if (imageLocation.startsWith('http')) return imageLocation;
    return 'https://localhost:7290/' + imageLocation;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  addToCart(product: any): void {
    if (!this.isLoggedIn()) {
      alert('Please login to add product to cart');
      return;
    }
    this.cartService.addToCart(product);
  }

  // 🔒 kept for safety (not breaking old logic)
  onSearch(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.products = this.allProducts;
      return;
    }

    this.products = this.allProducts.filter(p =>
      (p.name && p.name.toLowerCase().includes(text)) ||
      (p.brand && p.brand.toLowerCase().includes(text))
    );
  }
}
