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

  selectedProductId: number | null = null;
rejectionReason: string = '';


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

  imageLocation: string = '';
  selectedFile!: File;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // =========================
  // LOAD DATA
  // =========================
  loadProducts() {
    this.http.get<any[]>(this.productApi).subscribe(res => {
      debugger;
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
  // IMAGE DISPLAY HELPER ✅
  // =========================
  getImageUrl(imageLocation: string): string {
    if (!imageLocation) {
      return 'assets/no-image.png'; // fallback
    }

    if (imageLocation.startsWith('http')) {
      return imageLocation;
    }

    return 'https://localhost:7290/' + imageLocation;
  }

  // =========================
  // CREATE / UPDATE (UNCHANGED)
  // =========================
  saveProduct() {
    if (!this.name || !this.price || !this.categoryid || !this.subcategoryid) return;

    const formData = new FormData();

    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('brand', this.brand);
    formData.append('price', this.price.toString());
    formData.append('stockquantity', this.stockquantity?.toString() || '0');
    formData.append('status', this.status);
    formData.append('categoryid', this.categoryid.toString());
    formData.append('subcategoryid', this.subcategoryid.toString());
    formData.append('image', this.selectedFile);

    if (this.id === null) {
      formData.append('createdby', 'admin');

      this.http.post(this.productApi, formData).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else {
      formData.append('updatedby', 'admin');
      formData.append('isactive', 'true');

      this.http.put(`${this.productApi}/${this.id}`, formData).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  editProduct(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.brand = item.brand;
    this.description = item.description;
    this.price = item.price;
    this.stockquantity = item.stockquantity;
    this.status = item.status;
    this.categoryid = item.categoryId;

    this.loadSubCategories(item.categoryId);
    this.subcategoryid = item.subCategoryId;
  }

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
  
  approvedProduct(id: number) {
    
    if (!confirm('Are you sure to approve this product?')) return;  
    this.http.put(`https://localhost:7290/api/Product/approve/${id}`, {}).subscribe(() => {
      this.loadProducts();
    });
  }

 updateRejectionReason() {

  debugger;
  if (!this.selectedProductId) return;

  const payload = {
    id: this.selectedProductId,
    reason: this.rejectionReason
  };

  console.log(payload);

  // Example API call
  this.http.put(`https://localhost:7290/api/Product/updateRejectionReason`, payload).subscribe(() => {
      this.loadProducts();
    });
}


  openRejectModal(productId: number) {
  this.selectedProductId = productId;
  this.rejectionReason = ''; // reset textarea
}

}
