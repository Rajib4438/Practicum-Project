import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-sub-category-list',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class AdminSubCategoryListComponent implements OnInit {

  apiUrl = 'https://localhost:7290/api/SubCategory'; // 🔴 তোমার API URL

  subCategories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubCategories();
  }

  // =========================
  // GET ALL SUB CATEGORY
  // =========================
  loadSubCategories() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => this.subCategories = res,
      error: (err) => console.error('Error loading sub categories', err)
    });
  }

  // Status text helper
  getStatus(value: boolean) {
    return value ? 'Active' : 'Inactive';
  }
}
