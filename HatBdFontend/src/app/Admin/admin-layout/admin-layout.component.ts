import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Routes } from '@angular/router';
// import { AdminProfileComponent } from './admin-profile/admin-profile.component'; // Make sure path is correct

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {}

// ✅ Admin routes
// export const adminRoutes: Routes = [
//   { path: 'layout/profile', component: AdminProfileComponent },
//   // Add your other admin routes here
// ];
