import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './adminproduct.component.html',
  styleUrls: ['./adminproduct.component.css']
})
export class AdminProductComponent implements OnInit {

  // 🔴 API URLs
  productApi = 'https://localhost:7290/api/Product';
  categoryApi = 'https://localhost:7290/api/Category';
  subCategoryApi = 'https://localhost:7290/api/SubCategory/by-category';

  products: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  // form model
  id: number | null = null;
  name = '';
  brand = '';
  description = '';
  price: number | null = null;
  stockquantity: number | null = null;
  status = '';

  categoryid: number | null = null;
  subcategoryid: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // =========================
  // LOAD DATA
  // =========================
  loadProducts() {
    this.http.get<any[]>(this.productApi).subscribe(res => {
      this.products = res;
    });
  }

  loadCategories() {
    this.http.get<any[]>(this.categoryApi).subscribe(res => {
      this.categories = res;
    });
  }

  loadSubCategories(categoryId: number) {
    this.http.get<any[]>(`${this.subCategoryApi}/${categoryId}`).subscribe(res => {
      this.subCategories = res;
    });
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  saveProduct() {
    if (!this.name || !this.price || !this.categoryid || !this.subcategoryid) return;

    const body: any = {
      name: this.name,
      brand: this.brand,
      description: this.description,
      price: this.price,
      stockquantity: this.stockquantity,
      status: this.status,
      categoryid: this.categoryid,
      subcategoryid: this.subcategoryid
    };

    // CREATE
    if (this.id === null) {
      body.createdby = 'admin';

      this.http.post(this.productApi, body).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
    // UPDATE
    else {
      body.updatedby = 'admin';
      body.isactive = true;

      this.http.put(`${this.productApi}/${this.id}`, body).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editProduct(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.brand = item.brand;
    this.description = item.description;
    this.price = item.price;
    this.stockquantity = item.stockQuantity;
    this.status = item.status;
    this.categoryid = item.categoryId;

    this.loadSubCategories(item.categoryId);
    this.subcategoryid = item.subCategoryId;
  }

  // =========================
  // DELETE
  // =========================
  deleteProduct(id: number) {
    if (!confirm('Are you sure?')) return;

    this.http.delete(`${this.productApi}/${id}`).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm() {
    this.id = null;
    this.name = '';
    this.brand = '';
    this.description = '';
    this.price = null;
    this.stockquantity = null;
    this.status = '';
    this.categoryid = null;
    this.subcategoryid = null;
    this.subCategories = [];
  }
}
