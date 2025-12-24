import { Component, OnInit, signal } from '@angular/core'; // signal import kora hoyeche
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterModule, CommonModule,FooterComponent],
  templateUrl: './nabver.component.html', // banan check korun (nabver vs navbar)
  styleUrls: ['./nabver.component.css']
})
export class NavbarComponent implements OnInit {

  // Cart er jonno Signal (Default 0 deya holo)
  cartCount = signal<number>(0); 

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ekhane apni pore database theke cart value load korben.
    // Udahoron swarup, ami ekhon 2 set kore dicchi jate apni badge dekhte pan:
    this.cartCount.set(2); 
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getUserName(): string {
    const name = localStorage.getItem('userName'); 
    return name ? name : 'User';
  }

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    this.router.navigate(['/']).then(() => {
      window.location.reload(); 
    });
  }

  // Cart page-e jaoar function
  goToCart(): void {
    this.router.navigate(['/cart']); // '/cart' route apnar routing file-e thakte hobe
  }
}