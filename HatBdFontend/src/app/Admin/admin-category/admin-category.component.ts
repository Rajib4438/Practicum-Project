import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {

  apiUrl = 'https://localhost:7290/api/Category'; // 🔴 তোমার API URL বসাও

  categories: any[] = [];
  categoryName: string = '';
  editId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // =========================
  // GET ALL CATEGORY
  // =========================
  loadCategories() {
    this.http.get<any[]>(this.apiUrl).subscribe(res => {
      this.categories = res;
    });
  }

  // =========================
  // CREATE / UPDATE CATEGORY
  // =========================
  saveCategory() {
    if (!this.categoryName) return;

    if (this.editId === null) {
      // CREATE
      const body = {
        name: this.categoryName,
        createdby: 'admin'
      };

      this.http.post(this.apiUrl, body).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });

    } else {
      // UPDATE
      const body = {
        name: this.categoryName,
        updatedby: 'admin',
        isactive: true
      };

      this.http.put(`${this.apiUrl}/${this.editId}`, body).subscribe(() => {
        this.resetForm();
        this.loadCategories();
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editCategory(item: any) {
    this.editId = item.id;
    this.categoryName = item.name;
  }

  // =========================
  // DELETE
  // =========================
  deleteCategory(id: number) {
    if (!confirm('Are you sure?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadCategories();
    });
  }

  resetForm() {
    this.categoryName = '';
    this.editId = null;
  }
}
