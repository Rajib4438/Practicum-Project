import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './seller-layout.component.html',
  styleUrls: ['./seller-layout.component.css']
})

export class SellerLayoutComponent {

  constructor(private http: HttpClient, private router: Router) {}
  showProfileMenu = false;

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
