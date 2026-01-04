import { Component, computed } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../app/Services/app.service';
 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterModule,
    CommonModule,
    FooterComponent
  ],
  templateUrl: './nabver.component.html',
  styleUrls: ['./nabver.component.css']
})
export class NavbarComponent {

  // ✅ DIRECTLY SERVICE SIGNAL USE
   cartCount = computed(() => this.cartService.cartCount());

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'User';
  }

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
