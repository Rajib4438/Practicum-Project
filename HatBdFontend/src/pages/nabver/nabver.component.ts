import { Component, computed } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../app/Services/app.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterModule,
    CommonModule,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './nabver.component.html',
  styleUrls: ['./nabver.component.css']
})
export class NavbarComponent {

 cartQty$: Observable<number>;
  searchText = '';

  // ✅ DIRECTLY SERVICE SIGNAL USE
  //  cartCount = computed(() => this.cartService.cartCount);

  constructor(
    private router: Router,
    public cartService: CartService
  ) {
      this.cartQty$ = this.cartService.addCartQty$;
  }

  onSearch(): void {
    this.cartService.setSearch(this.searchText);

     if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }

  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'User';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  localStorage.removeItem('userId');
  localStorage.removeItem('cart');
  localStorage.removeItem('address'); 
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  goToCart(): void {
    debugger;
    this.router.navigate(['/cart']);
  }
}
