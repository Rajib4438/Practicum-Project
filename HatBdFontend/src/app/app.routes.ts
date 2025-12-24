import { Routes } from "@angular/router";
import { Login } from "../pages/login/login.component";
import { Registration } from "../pages/registration/registration.component";
import { Forgotpass } from "../pages/forgotpass/forgotpass.component";
import { ResetPasswordComponent } from "../pages/resetpass/resetpass.component";
import { HomeComponent } from "../pages/home/home.component";
import { NavbarComponent } from "../pages/nabver/nabver.component";
import { FooterComponent } from "../pages/footer/footer.component";
import { AdminDashboardComponent } from "./Admin/admin-dash-board/admin-dash-board.component";
import { AdminLayoutComponent } from "./Admin/admin-layout/admin-layout.component";
import { AdminCategoryComponent } from "./Admin/admin-category/admin-category.component";
import { AdminUserListComponent } from "./Admin/admin-user-list/admin-user.component";
import { AdminSubCategoryComponent } from "./Admin/admin-sub-catagory/admin-sub-catagory.component";
import { AdminSubCategoryListComponent } from "./Admin/sub-category-list/sub-category-list.component";
import { AdminProductComponent } from "./Admin/adminproduct/adminproduct.component";

export const routes: Routes = [
  { path: '',
    component: NavbarComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'footer', component: FooterComponent }
    ]
    
   },

  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  { path: 'forgotpass', component: Forgotpass },
  {path:'resetpass',component:ResetPasswordComponent},  

  // ✅ correct component
  { path: 'reset-pass', component: ResetPasswordComponent },

  // ✅ HOME
 
{ path: 'navbar', component: NavbarComponent },
{ path: 'dashboard', component: AdminDashboardComponent },
{ path: 'admin', component: AdminLayoutComponent},
{ path: 'layout', component: AdminLayoutComponent ,children:[
  {
    path:'category',component:AdminCategoryComponent
  },{
    path:'',
    component:AdminDashboardComponent
  },{
    path:'user',component:AdminUserListComponent
  },
  // {
  //   path:'subcategory',component:AdminSubCategoryListComponent
  // },
  {
    path:'subcategory',component:AdminSubCategoryComponent
  },
  {
    path:'product',component:AdminProductComponent
  }
]},
{ path: 'admin-layout', component: AdminLayoutComponent },
{ path: 'category', component: AdminCategoryComponent },
{ path: 'userlist', component: AdminUserListComponent },

  
];