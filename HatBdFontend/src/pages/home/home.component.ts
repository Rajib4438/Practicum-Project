import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,RouterModule],
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

  ngOnInit() { this.startSlider(); }
  ngOnDestroy() { if (this.sliderInterval) clearInterval(this.sliderInterval); }
  startSlider() { this.sliderInterval = setInterval(() => this.nextSlide(), 5000); }
  nextSlide() { this.slideIndex = (this.slideIndex + 1) % this.bannerImages.length; }
  prevSlide() { this.slideIndex = this.slideIndex === 0 ? this.bannerImages.length - 1 : this.slideIndex - 1; }
  openModal(mode: string) { this.isSignup = mode === 'signup'; this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }
  toggleAuthMode() { this.isSignup = !this.isSignup; }
  handleAuth(e: Event) { e.preventDefault(); alert('Action Successful!'); this.closeModal(); }
}