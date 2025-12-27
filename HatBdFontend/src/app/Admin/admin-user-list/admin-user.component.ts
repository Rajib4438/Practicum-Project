import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserListComponent implements OnInit {

  users: any[] = [];

  private apiUrl = 'https://localhost:7290/api/UserRegistration/all';
  //router: Router;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  goToAddUser(): void {
  this.router.navigate(['/layout/user-form']);
}


  loadUsers() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users', err)
    });
  }
}