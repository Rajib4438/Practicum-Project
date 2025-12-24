import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-sub-category',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-sub-catagory.component.html',
  styleUrls: ['./admin-sub-catagory.component.css']
})
export class AdminSubCategoryComponent implements OnInit {

  // 🔴 API URLs
  subCategoryApi = 'https://localhost:7290/api/SubCategory';
  categoryApi = 'https://localhost:7290/api/Category';

  categories: any[] = [];
  subCategories: any[] = [];

  name: string = '';
  categoryid: number | null = null;
  editId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();
  }

  // =========================
  // LOAD CATEGORY (DROPDOWN)
  // =========================
  loadCategories() {
    this.http.get<any[]>(this.categoryApi).subscribe(res => {
      this.categories = res;
    });
  }

  // =========================
  // LOAD SUB CATEGORY LIST
  // =========================
  loadSubCategories() {
    this.http.get<any[]>(this.subCategoryApi).subscribe(res => {
      this.subCategories = res;
    });
  }

  // =========================
  // CREATE / UPDATE SUBCATEGORY
  // =========================
  saveSubCategory() {
    if (!this.name || !this.categoryid) return;

    // CREATE
    if (this.editId === null) {
      const body = {
        name: this.name,
        createdby: 'admin',
        categoryid: this.categoryid
      };

      this.http.post(this.subCategoryApi, body).subscribe(() => {
        this.resetForm();
        this.loadSubCategories();
      });
    }
    // UPDATE
    else {
      const body = {
        name: this.name,
        updatedby: 'admin',
        isactive: true,
        isdelete: false,
        categoryid: this.categoryid
      };

      this.http.put(`${this.subCategoryApi}/${this.editId}`, body).subscribe(() => {
        this.resetForm();
        this.loadSubCategories();
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editSubCategory(item: any) {
    this.editId = item.id;
    this.name = item.name;
    this.categoryid = item.categoryid;
  }

  // =========================
  // DELETE
  // =========================
  deleteSubCategory(id: number) {
    if (!confirm('Are you sure you want to delete?')) return;

    this.http.delete(`${this.subCategoryApi}/${id}`).subscribe(() => {
      this.loadSubCategories();
    });
  }

  resetForm() {
    this.name = '';
    this.categoryid = null;
    this.editId = null;
  }
}
