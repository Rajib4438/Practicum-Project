import { Component, OnInit, OnDestroy } from '@angular/core';
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

  products: any[] = [];
  private productApi = 'https://localhost:7290/api/Product/approved';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

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

  openModal(mode: 'login' | 'signup'): void {
    this.isSignup = mode === 'signup';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  toggleAuthMode(): void {
    this.isSignup = !this.isSignup;
  }

  handleAuth(e: Event): void {
    e.preventDefault();
    alert('Action Successful!');
    this.closeModal();
  }

  loadProducts(): void {
    this.http.get<any[]>(this.productApi).subscribe({
      next: res => (this.products = res),
      error: err => console.error('Error loading products', err)
    });
  }

  getImageUrl(imageLocation: string): string {
    if (!imageLocation) return 'assets/no-image.png';
    if (imageLocation.startsWith('http')) return imageLocation;
    return 'https://localhost:7290/' + imageLocation;
  }

  // ✅ LOGIN CHECK
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken'); 
    // token এর নাম তোমার project অনুযায়ী ঠিক করো
  }

  // ✅ ADD TO CART FIXED
  addToCart(product: any): void {
    if (!this.isLoggedIn()) {
      alert('Please login to add product to cart');
      return;
    }
    this.cartService.addToCart(product);
  }
}
