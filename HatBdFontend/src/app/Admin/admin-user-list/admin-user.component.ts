import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserListComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';

  private apiUrl = 'https://localhost:7290/api/UserRegistration';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // =========================
  // LOAD ALL USERS
  // =========================
  loadUsers(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe({
      next: data => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: err => console.error('Error loading users', err)
    });
  }

  // =========================
  // SEARCH USER
  // =========================
  searchUser(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.fullName?.toLowerCase().includes(text) ||
      user.userName?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.phone?.toLowerCase().includes(text)
    );
  }

  // =========================
  // ADD USER
  // =========================
  goToAddUser(): void {
    this.router.navigate(['/layout/user-form']);
  }

  // =========================
  // APPROVE SELLER
  // =========================
  approveUser(id: number): void {
    if (!confirm('Approve this seller?')) return;

    this.http.put(`${this.apiUrl}/approve-seller/${id}`, {}).subscribe({
      next: () => {
        alert('Seller approved successfully');
        this.loadUsers();
      },
      error: err => console.error(err)
    });
  }

  // =========================
  // EDIT USER
  // =========================
  editUser(id: number): void {
    this.router.navigate(['/layout/user-form'], {
      queryParams: { id }
    });
  }

  // =========================
  // DELETE USER
  // =========================
  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) return;

    this.http.delete(`${this.apiUrl}/delete/${id}`).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.loadUsers();
      },
      error: err => console.error(err)
    });
  }
}
