import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-seller-my-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sellrt-myproduct.component.html',
  styleUrls: ['./sellrt-myproduct.component.css']
})
export class SellerMyProductComponent implements OnInit {

  productApi = 'https://localhost:7290/api/Product';
  categoryApi = 'https://localhost:7290/api/Category';
  subCategoryApi = 'https://localhost:7290/api/SubCategory/by-category';

  products: any[] = [];
  filteredProducts: any[] = [];

  categories: any[] = [];
  subCategories: any[] = [];

  searchText = '';

  // ===== FORM MODEL =====
  id: number | null = null;
  name = '';
  brand = ''; // ✅ BRAND
  description = '';
  price: number | null = null;
  stockquantity: number | null = null;
  status = 'Pending';

  categoryid: number | null = null;
  subcategoryid: number | null = null;
  selectedFile!: File;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // =========================
  // LOAD
  // =========================
  loadProducts() {
  const sellerId = Number(localStorage.getItem('userId'));

  this.http.get<any[]>(`${this.productApi}?sellerId=${sellerId}`).subscribe(res => {
    this.products = res;
    this.filteredProducts = res;
  });
}


  loadCategories() {
    this.http.get<any[]>(this.categoryApi).subscribe(res => {
      this.categories = res;
    });
  }

  loadSubCategories(categoryId: number) {
    this.http
      .get<any[]>(`${this.subCategoryApi}/${categoryId}`)
      .subscribe(res => {
        this.subCategories = res;
      });
  }

  // =========================
  // SEARCH
  // =========================
  searchProduct() {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(p =>
      p.name?.toLowerCase().includes(text) ||
      p.brand?.toLowerCase().includes(text) ||        // ✅ BRAND SEARCH
      p.categoryName?.toLowerCase().includes(text)
    );
  }

  // =========================
  // IMAGE
  // =========================
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getImageUrl(imageLocation: string): string {
    if (!imageLocation) return 'assets/no-image.png';
    return imageLocation.startsWith('http')
      ? imageLocation
      : 'https://localhost:7290/' + imageLocation;
  }

  // =========================
  // ADD / UPDATE
  // =========================
  saveProduct() {
    if (!this.name || !this.brand || !this.price || !this.categoryid || !this.subcategoryid) {
      alert('Fill required fields');
      return;
    }

    const sellerId = Number(localStorage.getItem('userId')); 
    // example after login



     const formData = new FormData();
  formData.append('name', this.name);
  formData.append('brand', this.brand);
  formData.append('description', this.description);
  formData.append('price', this.price!.toString());
  formData.append('stockquantity', this.stockquantity!.toString());
  formData.append('status', this.status);
  formData.append('categoryid', this.categoryid!.toString());
  formData.append('subcategoryid', this.subcategoryid!.toString());
  formData.append('SellerId', sellerId.toString());  // 👈 important
  formData.append('Image', this.selectedFile);

  this.http.post(this.productApi, formData).subscribe(() => {
    this.loadProducts();
  });

    // CREATE
    if (this.id === null) {
      formData.append('createdby', 'seller');

      this.http.post(this.productApi, formData).subscribe(() => {
        this.resetForm();
        this.loadProducts();
        alert('Product added');
      });
    }
    // UPDATE
    else {
      formData.append('updatedby', 'seller');
      formData.append('isactive', 'true');

      this.http.put(`${this.productApi}/${this.id}`, formData).subscribe(() => {
        alert('Product updated');
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  // =========================
  // EDIT
  // =========================
  editProduct(p: any) {
    this.id = p.id;
    this.name = p.name;
    this.brand = p.brand; // ✅ BRAND
    this.description = p.description;
    this.price = p.price;
    this.stockquantity = p.stockquantity;
    this.status = p.status;
    this.categoryid = p.categoryId;

    this.loadSubCategories(p.categoryId);
    this.subcategoryid = p.subCategoryId;
  }

  // =========================
  // DELETE
  // =========================
  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;

    this.http.delete(`${this.productApi}/${id}`).subscribe(() => {
      alert('Product deleted');
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
    this.status = 'Active';
    this.categoryid = null;
    this.subcategoryid = null;
    this.subCategories = [];
    this.selectedFile = undefined as any;
  }
}
