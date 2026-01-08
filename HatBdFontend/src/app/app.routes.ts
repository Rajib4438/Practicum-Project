import { Routes } from '@angular/router';

// ===== AUTH / USER =====
import { Login } from '../pages/login/login.component';
import { Registration } from '../pages/registration/registration.component';
import { Forgotpass } from '../pages/forgotpass/forgotpass.component';
import { ResetPasswordComponent } from '../pages/resetpass/resetpass.component';
import { HomeComponent } from '../pages/home/home.component';
import { NavbarComponent } from '../pages/nabver/nabver.component';
import { FooterComponent } from '../pages/footer/footer.component';
import { ProductListComponent } from '../pages/product-list/product-list.component';
import { CartComponent } from '../pages/cart/cart.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';

// ===== ADMIN =====
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './Admin/admin-dash-board/admin-dash-board.component';
import { AdminCategoryComponent } from './Admin/admin-category/admin-category.component';
import { AdminUserListComponent } from './Admin/admin-user-list/admin-user.component';
import { AdminSubCategoryComponent } from './Admin/admin-sub-catagory/admin-sub-catagory.component';
import { AdminProductComponent } from './Admin/adminproduct/adminproduct.component';
import { AdminOrderComponent } from './Admin/admin-order/admin-order.component';
import { Userform } from './Admin/admin-user-form/admin-user-form.component';

// ===== SELLER =====
import { SellerLayoutComponent } from './Seller/seller-layout/seller-layout.component';
import { SellerDashboardComponent } from './Seller/seller-dashboard/sell-dashboard.component';
import { SellerMyProductComponent } from './Seller/seller-myproduct/sellrt-myproduct.component';
import { OrderComponent } from '../pages/my-order/my-order.component';
import { AdminProfileComponent } from './Admin/adminprifile/adminprifile.component';
import { SellerProfileComponent } from './Seller/sellerprofile/sellerprofile.component';

export const routes: Routes = [

  // ================= USER PUBLIC AREA =================
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'footer', component: FooterComponent },
      { path: 'product-list', component: ProductListComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrderComponent },
      
    ]
  },

  // ================= AUTH =================
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  { path: 'forgotpass', component: Forgotpass },
  { path: 'resetpass', component: ResetPasswordComponent },

  // ================= ADMIN AREA (MAIN FIX) =================
  {
    path: 'layout',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent }, // default dashboard
      { path: 'user', component: AdminUserListComponent },
      { path: 'user-form', component: Userform },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'subcategory', component: AdminSubCategoryComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'order', component: AdminOrderComponent }, // ✅ ORDER MANAGE
      { path: 'profile', component: AdminProfileComponent }
    ]
  },

  // ================= SELLER AREA =================
  {
    path: 'seller',
    component: SellerLayoutComponent,
    children: [
      { path: 'dashboard', component: SellerDashboardComponent },
      { path: 'products', component: SellerMyProductComponent },
      { path: 'profile', component: SellerProfileComponent }
    ]
  },

  // ================= FALLBACK =================
  { path: '**', redirectTo: '' }
];
